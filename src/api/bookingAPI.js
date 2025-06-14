import API from "./config";

// admin bookings API

export const getBookings = () => {
  return API.get("/booking");
};

export const getSingleBooking = (id) => {
  return API.get(`/booking/${id}`);
};

export const deleteBooking = (id) => {
  return API.delete(`/booking/${id}`);
};

// customer bookings API

export const getCustomerBookings = (id) => {
  return API.get(`/bookings/by/${id}`);
};

export const getSingleCustomerBooking = (id) => {
  return API.get(`/booking/${id}`);
};

export const deleteCustomerBooking = (id) => {
  return API.delete(`/booking/${id}`);
};

export const deleterBooking = (id) => {
  return API.delete(`/booking/${id}`);
};

export const updatedBooking = (formdata, id) => {
  return API.put(`/booking/${id}`, formdata);
};

export const allComission = (formData) => {
  return API.get("/all/commission", formData);
};
