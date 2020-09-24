import React, { useContext, useState } from "react";
import { UserContext } from "../context/Context";
import { Link, Redirect } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

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

  const loginWithGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // var token = result.credential.accessToken;
        // console.log("tpken", token);
        // // The signed-in user info.
        // var user = result.user;
        addUserInfo(result);
        // console.log("user", user);
        // ...
      })
      .catch(function (error) {
        console.log(error);
        // Handle Errors here.
        // var errorCode = error.code;
        // var errorMessage = error.message;
        // // The email of the user's account used.
        // var email = error.email;
        // // The firebase.auth.AuthCredential type that was used.
        // var credential = error.credential;
        // ...
      });
  };

  if (state.user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container center-align mt-100">
      {!state.user && (
        <div className="center-align">
          <div className=" mt-80 w-100">
            <button onClick={loginWithGoogle} className="google-button">
              <span className="valign-wrapper ">
                <FcGoogle size={30} />
                Sign in with Google
              </span>
            </button>
          </div>
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
                    autoComplete="on"
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
                      Login
                    </button>
                  ) : (
                    <button className="waves-effect disabled waves-light btn-large ">
                      Login
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
