import React, { useContext, useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import { FaFilePdf } from "react-icons/fa";
import { UserContext } from "../context/Context";
import M from "materialize-css/dist/js/materialize.min.js";
import { toast } from "react-toastify";

const EvaluateTestStudent = ({ student }) => {
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");

  const { state } = useContext(UserContext);

  return <div>{console.log(student)}</div>;
};

export default EvaluateTestStudent;
