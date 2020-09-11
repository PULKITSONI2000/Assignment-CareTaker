import React, { useReducer, useEffect } from "react";
import reducer from "./reducer";
import { UserContext } from "./Context";

import firebase from "firebase/app";
import { SET_USER, SET_TEACHER } from "./action.types";

const ContextsProvider = ({ children }) => {
  const initialState = {
    user: false,
    teacher: false,
    classes: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userAuthStatus) => {
      // // TODO: remove
      // console.log("User Auth", userAuthStatus);
      if (userAuthStatus) {
        userAuthStatus.getIdTokenResult().then((idTokenResult) => {
          console.log("Teacher ", idTokenResult.claims.teacher);
          // user.admin = idTokenResult.claims.teacher;
          dispatch({
            type: SET_TEACHER,
            payload: idTokenResult.claims.teacher,
          });
        });

        dispatch({
          type: SET_USER,
          payload: userAuthStatus,
        });
      } else {
      }
    });
  }, []);

  return (
    <div>
      <UserContext.Provider value={{ state, dispatch }}>
        {children}
      </UserContext.Provider>
    </div>
  );
};

export default ContextsProvider;
