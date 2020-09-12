import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { UserContext } from "../context/Context";
import AddAssignment from "../components/AddAssignment";

const ViewClass = ({ match }) => {
  const [classInfo, setClassInfo] = useState({});

  const { state } = useContext(UserContext);

  useEffect(() => {
    // console.log(match.params.classcode);
    var unsubscribe = firebase
      .firestore()
      .collectionGroup("classes")
      .where("code", "==", match.params.classcode)
      .onSnapshot(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setClassInfo(doc.data());
          });
        },
        (err) => {
          console.log(err);
        }
      );
    return () => {
      unsubscribe();
      setClassInfo({});
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      {console.log("yo", classInfo)}
      <div>
        <div className="class-box">
          <h2>{classInfo.title}</h2>
          <p className="t-20">Teacher : {classInfo.teacher}</p>
          {classInfo.subject && <p>Subject : {classInfo.subject}</p>}
          {classInfo.section && <p>Section : {classInfo.section}</p>}
          <p>Code : {classInfo.code}</p>
        </div>
      </div>

      {/*/// Anouncement */}
      {state.teacher && <div className=" mt-20">Anouncement</div>}
      {/*/// add class */}
      {state.teacher && (
        <div className=" mt-20">
          <AddAssignment />
        </div>
      )}
    </div>
  );
};

export default ViewClass;
