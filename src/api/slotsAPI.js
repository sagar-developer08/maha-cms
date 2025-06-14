import API from "./config";

// slots API

export const postSlot = (formData) => {
  return API.post("/slot", formData);
};

export const getSlot = () => {
  return API.get("/slot");
};

export const getSingleSlot = (id) => {
  return API.get(`/slot/${id}`);
};

export const updateSlot = (id, formData) => {
  return API.put(`/slot/${id}`, formData);
};

export const deleteSlot = (id) => {
  return API.delete(`/slot/${id}`);
};
