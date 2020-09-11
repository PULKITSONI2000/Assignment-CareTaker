import React, { useContext } from "react";
import { UserContext } from "../context/Context";
import { Redirect } from "react-router-dom";
// import firebase from "firebase/app";
// import "firebase/firestore";

const Home = () => {
  const { state } = useContext(UserContext);

  if (!state.user) {
    console.log("State At home", state);
    return <Redirect to="/login" />;
  }

  return <div>home page</div>;
};

export default Home;
