import React from "react";
import Api from "./config";

function commonApi() {
  const getUsersList = () => {
    return Api.get("/users");
  };
  const getOneUser = (id) => {
    return Api.get(`/users/${id}`);
  };
  const UpdateOneUser = (id, formData) => {
    return Api.put(`/users/${id}`, formData);
  };
  const DeleteOneUser = (id) => {
    return Api.delete(`/users/${id}`);
  };

  const AddUser = (formData, header) => {
    return Api.post("/register", formData, header);
  };

  const UpdatePassword = (id, formData) => {
    return Api.post(`/updatePassword/${id}`, formData);
  };
  const PostForgotPass = (formData) => {
    return Api.post("/forgotPassword", formData);
  };

  return {
    getUsersList,
    getOneUser,
    UpdateOneUser,
    DeleteOneUser,
    AddUser,
    UpdatePassword,
    PostForgotPass,
  };
}

export default commonApi;
