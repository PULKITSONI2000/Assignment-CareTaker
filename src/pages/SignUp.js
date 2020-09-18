import React, { useContext, useState } from "react";
import { UserContext } from "../context/Context";
import firebase from "firebase/app";
import "firebase/auth";
import { toast } from "react-toastify";
import { Redirect } from "react-router-dom";
import { Col, Row } from "react-materialize";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [authStatus, setAuthStatus] = useState("");

  const { state } = useContext(UserContext);

  const addUserInfo = (cred) => {
    firebase
      .firestore()
      .collection("user")
      .doc(cred.user.uid)
      .set({
        userId: cred.user.uid,
        name: cred.user.displayName || displayName,
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

  const handleSignUp = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        console.log(res);
        setAuthStatus("Succssfully Sign Up");
        addUserInfo(res);

        firebase
          .auth()
          .currentUser.updateProfile({
            displayName: displayName,
            // photoURL: "https://example.com/jane-q-user/profile.jpg",
          })
          .then(function () {
            // Update successful.
            console.log("success");
          })
          .catch(function (error) {
            toast.error(`Error while setting displayName, ${error.message}`);
          });
      })
      .catch((error) => {
        // console.log(error);
        toast.error(error.message);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp();
  };

  return (
    <div className="container center-align mt-100">
      {!state.user && (
        <div className="mt-100">
          <StyledFirebaseAuth
            className=" mt-100 w-100"
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
          <div className="center-align">OR</div>

          {authStatus && <h5 className="green-text center">{authStatus}</h5>}
          <Row>
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

                {/* /// displayName */}
                <div className="input-field">
                  <input
                    id="displayName"
                    type="text"
                    className="validate"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <label htmlFor="displayName">Full Name</label>
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
                  {email && displayName && password ? (
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
        </div>
      )}
    </div>
  );
};

export default SignUp;
