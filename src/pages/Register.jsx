import React from "react";
import RegisterComp from "src/components/Register/Index";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
function Register() {
  let location = useLocation();

  const { isAuth } = useSelector((state) => state.auth);
  if (isAuth) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return (
    <div>
      <RegisterComp />
    </div>
  );
}

export default Register;
