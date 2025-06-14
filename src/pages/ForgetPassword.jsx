import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import ForgotPassword from "src/components/ForgotPassword/Index";
function Login() {
  let location = useLocation();

  const { isAuth } = useSelector((state) => state.auth);
  if (isAuth) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return (
    <div>
      <ForgotPassword />
    </div>
  );
}

export default Login;
