import API from "./config";

// Package API

export const postPackage = (formData, header) => {
  return API.post("/package", formData, header);
};

export const getPackage = () => {
  return API.get("/package");
};

export const getSinglePackage = (id) => {
  return API.get(`/package/${id}`);
};

export const updatePackage = (formData, header) => {
  return API.put(`/package/${formData?.id}`, formData, header);
};

export const deletePackage = (id) => {
  return API.delete(`/package/${id}`);
};

// Itinary API

export const postItinary = (formData, header) => {
  return API.post("/itinerary", formData, header);
};

export const getItinary = () => {
  return API.get("/itinerary");
};

export const getSingleItinary = (id) => {
  return API.get(`/itinerary/${id}`);
};

export const updateItinary = (formData, id) => {
  return API.put(`/itinerary/${id}`, formData);
};

export const deleteItinary = (id) => {
  return API.delete(`/itinerary/${id}`);
};
