import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../context/Context";

const PrivateUserRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(
        props // for location // can also be destructure as {location}
      ) => {
        return state.user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateUserRoute;
