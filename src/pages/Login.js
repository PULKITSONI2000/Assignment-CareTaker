import React, { useContext } from "react";
import { UserContext } from "../context/Context";
import { Redirect } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import firebase from "firebase/app";
import "firebase/firestore";

const Login = () => {
  const { state } = useContext(UserContext);

  const addUserInfo = (cred) => {
    firebase
      .firestore()
      .collection("user")
      .doc(cred.user.uid)
      .set({
        userId: cred.user.uid,
        name: cred.user.displayName,
        email: cred.user.email,
      })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  /// Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/",
    // We will display Google and Email as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: (user) => {
        addUserInfo(user);
      },
    },
  };

  if (state.user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container">
      {!state.user && (
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      )}
    </div>
  );
};

export default Login;
