import { axiosWithCreds } from "./axiosInstances";

export const getActiveSubscription = async () => {
  const { data } = await axiosWithCreds.get("/subscription/active");
  return data;
};

export const createSubscription = async (planId) => {
  const { data } = await axiosWithCreds.post("/subscription", { planId });
  return data;
};

export const verifySubscription = async (payload) => {
  const { data } = await axiosWithCreds.post("/subscription/verify", payload);
  return data;
};

export const cancelSubscription = async (subscriptionId) => {
  const { data } = await axiosWithCreds.post(`/subscription/${subscriptionId}/cancel`);
  return data;
};

export const getUpdatePaymentLink = async (subscriptionId) => {
  const { data } = await axiosWithCreds.get(`/subscription/${subscriptionId}/update-payment`);
  return data;
};

export const getPaymentHistory = async (subscriptionId) => {
  const { data } = await axiosWithCreds.get(`/subscription/${subscriptionId}/payments`);
  return data;
};
