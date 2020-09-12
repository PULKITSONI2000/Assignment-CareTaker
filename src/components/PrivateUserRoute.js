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
        const tempState = state;

        return tempState.user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default PrivateUserRoute;
