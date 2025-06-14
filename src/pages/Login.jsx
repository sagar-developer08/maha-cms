import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import LoginComp from "src/components/Login/Index";
function Login() {
  let location = useLocation();

  const { isAuth } = useSelector((state) => state.auth);
  if (isAuth) {
    return <Navigate to="/" state={{ from: location }} />;
  }
  return (
    <div>
      <LoginComp />
    </div>
  );
}

export default Login;
