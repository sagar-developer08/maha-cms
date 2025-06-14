import React from "react";
import Api from "./config";

function useAuthApi() {
  const PostRegister = (formData) => {
    return Api.post("/register", formData);
  };
  const PostLogin = (formData, header) => {
    return Api.post("/login", formData, header);
  };
  const PostUploadId = (formData, header) => {
    return Api.post("/upload-ids", formData, header);
  };

  return { PostRegister, PostLogin, PostUploadId };
}

export default useAuthApi;
