import React, { useContext } from "react";
import { UserContext } from "../context/Context";
import { Redirect } from "react-router-dom";
import { Col, Row } from "react-materialize";
import ClassCard from "../components/ClassCard";
// import firebase from "firebase/app";
// import "firebase/firestore";

const Home = () => {
  const { state } = useContext(UserContext);
  const user = state.user;

  if (!user) {
    return <Redirect to="/login" />;
  }
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
