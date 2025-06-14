import React, { useContext } from "react";
import LangContext from "src/utils/LanguageContext";

import { useSelector } from "react-redux";
import { Navigate, Route, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, baseHome, roles }) => {
  let location = useLocation();

  const { lang = "en", setLang } = useContext(LangContext);
  const { isAuth, role, userData, loading } = useSelector(
    (state) => state.auth
  );

  if (baseHome) {
    if (role == "admin") {
      return (
        <Navigate to={`/${lang}/admin/dashboard`} state={{ from: location }} />
      );
    } else if (role == "customer") {
      return (
        <Navigate
          to={`/${lang}/customer/dashboard`}
          state={{ from: location }}
        />
      );
    } else {
      return <Navigate to="/login" state={{ from: location }} />;
    }
  }

  return children;
};

export default PrivateRoute;
