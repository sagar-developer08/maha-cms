import API from "./config";

// Package API

export const getCommission = (id) => {
  return API.get(`/calculate-commission/${id}`);
};

export const getreferralList = (code) => {
  return API.get(`/referral/${code}`);
};
