// ── Global upload manager ──────────────────────────────────────────────────
// A plain external store (subscribe/getSnapshot, à la useSyncExternalStore).
// It does NOT own the upload logic itself — DirectoryView still owns
// uploadInitiate / uploadFileToR2 / uploadComplete / uploadCancel / the pool.
// This module is purely the shared, render-cheap source of truth that the
// global progress card and each temp file row/card read from, so that a
// progress tick updates only the tiny bits of UI that actually changed
// instead of the whole directory grid.
import { uploadCancel } from "../api/fileApi";

// ── internal state ─────────────────────────────────────────────────────────
const state = {
  phase: "idle", // idle | uploading | complete | error
  totalFiles: 0,
  completedFiles: 0,
  failedFiles: 0,
  totalBytes: 0,
  uploadedBytes: 0,
  uploadSpeed: 0, // bytes/sec
  activeUploads: 0,
  errorMessage: "",
};

const items = new Map(); // id -> { size, uploadedBytes, progress, status, xhr, fileId }
let speedSamples = []; // sliding window of { t, bytes }
// Smooth upload speed using an Exponential Moving Average (EMA)
let smoothedUploadSpeed = 0;
const SPEED_SMOOTHING = 0.08;
let lastSpeedUpdate = 0;
const SPEED_UPDATE_INTERVAL = 750;
let completeTimer = null;
let cancelledItemIds = new Set();

const globalListeners = new Set();
const itemListeners = new Map(); // id -> Set<fn>
const cancelListeners = new Set(); // fn(ids[])

let snapshot = buildSnapshot();

function buildSnapshot() {
  return {
    phase: state.phase,
    isUploading: state.phase === "uploading",
    totalFiles: state.totalFiles,
    completedFiles: state.completedFiles,
    failedFiles: state.failedFiles,
    totalBytes: state.totalBytes,
    uploadedBytes: state.uploadedBytes,
    uploadSpeed: state.uploadSpeed,
    overallProgress:
      state.totalBytes > 0
        ? Math.min(100, (state.uploadedBytes / state.totalBytes) * 100)
        : 0,
    activeUploads: state.activeUploads,
    errorMessage: state.errorMessage,
  };
}

let notifyScheduled = false;

function notifyGlobal() {
  snapshot = buildSnapshot();
  globalListeners.forEach((l) => l(snapshot));
}

function scheduleNotifyGlobal() {
  if (notifyScheduled) return;

  notifyScheduled = true;

  const raf =
    typeof requestAnimationFrame === "function"
      ? requestAnimationFrame
      : (fn) => setTimeout(fn, 16);

  raf(() => {
    notifyScheduled = false;
    notifyGlobal();
  });
}

function notifyItem(id) {
  itemListeners.get(id)?.forEach((l) => l());
}

// ── subscriptions ──────────────────────────────────────────────────────────
export function subscribe(listener) {
  globalListeners.add(listener);
  return () => globalListeners.delete(listener);
}
export function getSnapshot() {
  return snapshot;
}

export function subscribeItem(id, listener) {
  if (!itemListeners.has(id)) itemListeners.set(id, new Set());
  itemListeners.get(id).add(listener);
  return () => itemListeners.get(id)?.delete(listener);
}
export function getItemProgress(id) {
  return items.get(id)?.progress ?? 0;
}

export function subscribeCancel(listener) {
  cancelListeners.add(listener);
  return () => cancelListeners.delete(listener);
}

function roundSpeed(speed) {
  if (speed <= 0) return 0;

  // Under 1 MB/s -> nearest 50 KB/s
  if (speed < 1024 * 1024) {
    return Math.round(speed / (50 * 1024)) * (50 * 1024);
  }

  // 1 MB/s+ -> nearest 0.1 MB/s
  return (
    Math.round(speed / (0.1 * 1024 * 1024)) *
    (0.1 * 1024 * 1024)
  );
}

// ── recalculation ──────────────────────────────────────────────────────────
function recalcTotals() {
  let uploaded = 0;

  items.forEach((it) => {
    uploaded += it.uploadedBytes;
  });

  state.uploadedBytes = uploaded;

  const now = Date.now();

  speedSamples.push({
    t: now,
    bytes: uploaded,
  });

  // Keep only the last 2 seconds of history
  while (
    speedSamples.length > 1 &&
    now - speedSamples[0].t > 7000
  ) {
    speedSamples.shift();
  }

  let rawSpeed = 0;

  if (speedSamples.length >= 2) {
    const first = speedSamples[0];

    const dt = (now - first.t) / 1000;
    const db = uploaded - first.bytes;

    rawSpeed = dt > 0 ? Math.max(0, db / dt) : 0;
  }

  // Smooth the speed (EMA)
  if (rawSpeed === 0) {
    smoothedUploadSpeed *= 0.9;

    if (smoothedUploadSpeed < 1024) {
      smoothedUploadSpeed = 0;
    }
  } else if (smoothedUploadSpeed === 0) {
    smoothedUploadSpeed = rawSpeed;
  } else {
    smoothedUploadSpeed =
      smoothedUploadSpeed * (1 - SPEED_SMOOTHING) +
      rawSpeed * SPEED_SMOOTHING;
  }

  // Only expose a new speed every 750ms
  if (
    now - lastSpeedUpdate >= SPEED_UPDATE_INTERVAL ||
    state.uploadSpeed === 0
  ) {
    state.uploadSpeed = roundSpeed(smoothedUploadSpeed);
    lastSpeedUpdate = now;
  }
}
function checkBatchComplete() {
  if (state.activeUploads === 0 && state.phase === "uploading") {
    state.phase = "complete";
    notifyGlobal();
    if (completeTimer) clearTimeout(completeTimer);
    completeTimer = setTimeout(() => resetBatch(), 1800);
  }
}

// ── batch lifecycle ────────────────────────────────────────────────────────
export function beginBatch(files, dirId) {
  if (completeTimer) {
    clearTimeout(completeTimer);
    completeTimer = null;
  }
  const tempItems = files.map((file) => ({
    file,
    id: `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    size: file.size,
    contentType: file.type,
    dirId,
  }));

  tempItems.forEach((t) => {
    items.set(t.id, {
      size: t.size || 0,
      uploadedBytes: 0,
      progress: 0,
      status: "uploading",
      xhr: null,
      fileId: null,
    });
  });

  state.phase = "uploading";
  state.totalFiles += tempItems.length;
  state.totalBytes += tempItems.reduce((s, f) => s + (f.size || 0), 0);
  state.activeUploads += tempItems.length;
  state.errorMessage = "";
  recalcTotals();
  notifyGlobal();
  return tempItems;
}

export function registerXhr(id, xhr, fileId) {
  const it = items.get(id);
  if (it) {
    it.xhr = xhr;
    it.fileId = fileId;
  }
}

export function updateItemProgress(id, loadedBytes) {
  const it = items.get(id);
  if (!it) return;
  it.uploadedBytes = loadedBytes;
  it.progress = it.size ? Math.min(100, (loadedBytes / it.size) * 100) : 0;
  notifyItem(id);
  recalcTotals();
  scheduleNotifyGlobal();
}

export function markItemDone(id) {
  const it = items.get(id);
  if (!it) return;
  it.status = "done";
  it.progress = 100;
  it.uploadedBytes = it.size;
  state.completedFiles += 1;
  state.activeUploads = Math.max(0, state.activeUploads - 1);
  notifyItem(id);
  recalcTotals();
  checkBatchComplete();
  notifyGlobal();
}

export function markItemFailed(id) {
  const it = items.get(id);
  if (!it) return;
  state.failedFiles += 1;
  state.activeUploads = Math.max(0, state.activeUploads - 1);
  // Drop the failed file's bytes from the denominator so progress doesn't stall.
  state.totalBytes = Math.max(0, state.totalBytes - it.size);
  items.delete(id);
  itemListeners.delete(id);
  recalcTotals();
  checkBatchComplete();
  notifyGlobal();
}

export function isCancelled(id) {
  return cancelledItemIds.has(id);
}

export function resetBatch() {
  state.phase = "idle";
  state.totalFiles = 0;
  state.completedFiles = 0;
  state.failedFiles = 0;
  state.totalBytes = 0;
  state.uploadedBytes = 0;
  state.uploadSpeed = 0;
  state.activeUploads = 0;
  state.errorMessage = "";
  speedSamples = [];
  smoothedUploadSpeed = 0;
  lastSpeedUpdate = 0;
  items.clear();
  notifyGlobal();
}

// Flash a standalone error (e.g. quota rejected before any upload started)
// without needing a running batch — auto-clears itself.
export function flashError(message) {
  if (completeTimer) clearTimeout(completeTimer);
  state.phase = "error";
  state.errorMessage = message || "Upload failed";
  notifyGlobal();
  completeTimer = setTimeout(() => resetBatch(), 3000);
}

export function cancelAll() {
  if (completeTimer) {
    clearTimeout(completeTimer);
    completeTimer = null;
  }
  const ids = Array.from(items.keys());
  if (!ids.length) return ids;
  ids.forEach((id) => cancelledItemIds.add(id));

  // Abort every in-flight request synchronously and collect the fileIds
  // that still need server-side cleanup.
  const fileIdsToCancel = [];
  ids.forEach((id) => {
    const it = items.get(id);
    if (!it) return;
    try {
      it.xhr?.abort();
    } catch {
      /* no-op */
    }
    if (it.fileId) fileIdsToCancel.push(it.fileId);
  });

  // Update the UI immediately — the person shouldn't wait on a network
  // round trip just to see the temp files disappear and the card hide.
  cancelListeners.forEach((fn) => fn(ids));
  resetBatch();

  // Best-effort server-side cleanup, fired in the background.
  fileIdsToCancel.forEach((fileId) => {
    uploadCancel({ fileId }).catch(() => {
      /* no-op — best effort cleanup */
    });
  });

  // Grace period so pool tasks still catching up can see they were cancelled.
  setTimeout(() => {
    ids.forEach((id) => cancelledItemIds.delete(id));
  }, 15000);

  return ids;
}
