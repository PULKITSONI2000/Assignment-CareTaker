import React, { useReducer, useEffect } from "react";
import reducer from "./reducer";
import { UserContext } from "./Context";

import firebase from "firebase/app";
import { SET_USER } from "./action.types";

const ContextsProvider = ({ children }) => {
  const initialState = {
    user: false,
    classes: [],
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userAuthStatus) => {
      // TODO: remove
      console.log("User Auth", userAuthStatus);

      dispatch({
        type: SET_USER,
        payload: userAuthStatus,
      });
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
