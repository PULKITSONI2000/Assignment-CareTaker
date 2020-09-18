import React, { useContext } from "react";
import { UserContext } from "../context/Context";
import { Redirect } from "react-router-dom";
import { Col, Row } from "react-materialize";
import ClassCard from "../components/ClassCard";
import { toast } from "react-toastify";
import firebase from "firebase/app";
import "firebase/auth";

const Home = () => {
  const { state } = useContext(UserContext);

  if (!state.user) {
    return <Redirect to="/login" />;
  }

  const verifyEmail = () => {
    if (!state.user.emailVerified) {
      console.log("mail");
      firebase
        .auth()
        .currentUser.sendEmailVerification()
        .then(function () {
          console.log("mailsend");
          toast.success("Verification Mail has been Send");
        })
        .catch(function (error) {
          toast.error(`Error while setting displayName, ${error.message}`);
        });
    }
  };

  return (
    <div>
      <Row>
        {state.classes.length <= 0 ? (
          <div>
            <h2 className="center-align w-100 grey-text ">
              {state.teacher ? "No Class created yet" : "No class Join yet"}
            </h2>
            <br />
            <h4 className=" center-align w-100 grey-text ">
              {state.teacher
                ? "Press on Create class (button on top) to Create the class"
                : "Press on join class (button on top) to join the class"}
            </h4>

            {!state.user.emailVerified && (
              <div className="mt-100">
                <h3 className=" center-align w-100 grey-text">
                  Email is not Varified
                </h3>
                <h4 className=" center-align w-100 grey-text">
                  Please Varify your email by clinking on the button bellow
                </h4>
                <div className="center-align">
                  <button
                    className="waves-effect waves-light btn-large center-align mt-10"
                    onClick={verifyEmail}
                  >
                    Button
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Row>
            {state.classes.map((classInfo, index) => {
              return (
                <Col key={index} s={12} m={6} l={4}>
                  <ClassCard classInfo={classInfo} />
                </Col>
              );
            })}
          </Row>
        )}
      </Row>
    </div>
  );
};

export default Home;
