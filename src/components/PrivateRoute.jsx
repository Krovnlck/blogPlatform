import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isAuth, children }) => {
  if (!isAuth) {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
};

export default PrivateRoute; 