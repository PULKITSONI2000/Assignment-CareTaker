import React, { useContext, useState } from "react";
import { UserContext } from "../context/Context";
import { Link, Redirect } from "react-router-dom";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

import firebase from "firebase/app";
import "firebase/firestore";
import { toast } from "react-toastify";
import { Col, Row } from "react-materialize";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        toast.error("Error writing document: ");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((res) => {
        addUserInfo(res);
      })
      .catch((error) => {
        console.log(error);
        toast(error.message, {
          type: "error",
        });
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
      // firebase.auth.EmailAuthProvider.PROVIDER_ID,
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
    <div className="container center-align mt-100">
      {!state.user && (
        <div className="center-align">
          <StyledFirebaseAuth
            className=" mt-100 w-100"
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
          <div className="center-align">OR</div>

          <Row className="center-align mt-10">
            <Col s={12} m={4} offset={"m4"}>
              <form onSubmit={handleSubmit}>
                {/* /// email */}
                <div className="input-field">
                  <input
                    id="email"
                    type="email"
                    className="validate"
                    value={email}
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <label htmlFor="email">Email</label>
                </div>

                {/* /// Password */}
                <div className="input-field">
                  <input
                    id="password"
                    type="password"
                    className="validate"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <label htmlFor="password">Password</label>
                </div>

                <div className="center-align">
                  {email && password ? (
                    <button
                      type="submit"
                      className="waves-effect waves-light btn-large "
                    >
                      SignUp
                    </button>
                  ) : (
                    <button className="waves-effect disabled waves-light btn-large ">
                      SignUp
                    </button>
                  )}
                </div>
              </form>
            </Col>
          </Row>

          <h6 className="center-align mt-20">
            Create an Account? <Link to="/signup">SignUp</Link>
          </h6>
        </div>
      )}
    </div>
  );
};

export default Login;
