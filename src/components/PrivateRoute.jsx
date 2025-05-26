import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ isAuth, children, ...rest }) => (
  <Route
    {...rest}
    render={({ location }) =>
      isAuth ? (
        children
      ) : (
        <Redirect to={{ pathname: "/sign-in", state: { from: location } }} />
      )
    }
  />
);

export default PrivateRoute; 