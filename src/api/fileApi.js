import { axiosWithCreds } from "./axiosInstances";

export const deleteFile = async (id) => {
  const { data } = await axiosWithCreds.delete(`/file/${id}`);
  return data;
};

export const renameFile = async (id, newFilename) => {
  const { data } = await axiosWithCreds.patch(`/file/${id}`, {
    newFilename,
  });
  return data;
};

export const uploadInitiate = async (metaData) => {
  const { data } = await axiosWithCreds.post(`/file/upload/initiate`, metaData);
  return data;
};

export const uploadComplete = async (metaData) => {
  const { data } = await axiosWithCreds.post(`/file/upload/complete`, metaData);
  return data;
};

export const uploadCancel = async (metaData) => {
  const { data } = await axiosWithCreds.post(`/file/upload/cancel`, metaData);
  return data;
};


