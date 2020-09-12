import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "../context/Context";

const PrivateTeacherRoute = ({ component: Component, ...rest }) => {
  const { state } = useContext(UserContext);

  // console.log("router", state);

  return (
    <Route
      {...rest}
      render={(
        props // for location // can also be destructure as {location}
      ) => {
        const tempState = state;
        return tempState.user ? (
          tempState.teacher === true ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          )
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

export default PrivateTeacherRoute;
