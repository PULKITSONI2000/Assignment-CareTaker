import React, { useReducer, useEffect } from "react";
import reducer from "./reducer";
import { UserContext } from "./Context";

import firebase from "firebase/app";
import { SET_USER, SET_TEACHER, SET_CLASSES } from "./action.types";

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
          if (idTokenResult.claims.teacher) {
            firebase
              .firestore()
              .collectionGroup("classes")
              .where("teacher", "==", userAuthStatus.displayName)
              .get()
              .then((querySnapshot) => {
                var classes = [];
                querySnapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                  // console.log(doc.id, " => ", doc.data());
                  classes.push(doc.data());
                });
                dispatch({
                  type: SET_CLASSES,
                  payload: classes,
                });
              })
              .catch((error) => {
                console.log("Error getting documents: ", error);
              });
          } else {
          }
          /// setClass
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
