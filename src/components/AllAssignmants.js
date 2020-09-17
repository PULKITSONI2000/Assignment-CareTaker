import React, { useContext, useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import { GrDocumentPdf, GrDocumentText } from "react-icons/gr";
import { Link } from "react-router-dom";
import { UserContext } from "../context/Context";

const AllAssignmants = ({ classCode }) => {
  const [assignments, setAssignments] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    // console.log(match.params.classcode);
    var unsubscribe = firebase
      .firestore()
      .collectionGroup("assignment")
      .where("classCode", "==", classCode)
      .onSnapshot(
        (querySnapshot) => {
          var assigns = [];
          querySnapshot.forEach((doc) => {
            assigns.push(doc.data());
          });
          setAssignments(assigns);
        },
        (err) => {
          console.log(err);
        }
      );
    return () => {
      unsubscribe();
      setAssignments([]);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <ul className="collection">
        {assignments.map((assign, index) => (
          <li key={index} className="collection-item avatar">
            {/* <i className="material-icons circle red">play_arrow</i> */}

            {assign.assignmentFiles.length > 0 ? (
              <i className="circle red">
                <GrDocumentPdf size={22} color="red" />
              </i>
            ) : (
              <i className="circle blue">
                <GrDocumentText size={22} color="blue" />
              </i>
            )}

            <Link
              to={
                state.teacher
                  ? `/assignment/report/${assign.assignmentId}`
                  : `/assignment/${assign.assignmentId}`
              }
              className="title"
            >
              {assign.name}
            </Link>
            <p>
              Due Date :{"   "}
              {/* {String(assign.data.dueDate.toDate().getDate())} */}
              <span className="">{`${
                (new Date(assign.dueDate.toDate()).getHours() % 12 || "12") < 10
                  ? `0${
                      new Date(assign.dueDate.toDate()).getHours() % 12 || "12"
                    }`
                  : new Date(assign.dueDate.toDate()).getHours() % 12 || "12"
              } : ${
                new Date(assign.dueDate.toDate()).getMinutes() < 10
                  ? `0${new Date(assign.dueDate.toDate()).getMinutes()}`
                  : new Date(assign.dueDate.toDate()).getMinutes()
              } ${
                new Date(assign.dueDate.toDate()).getHours() >= 12 ? "PM" : "AM"
              }`}</span>
              <span className="ml-10">{`${new Date(
                assign.dueDate.toDate()
              ).getDate()} / ${new Date(
                assign.dueDate.toDate()
              ).getMonth()} / ${new Date(
                assign.dueDate.toDate()
              ).getFullYear()}`}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllAssignmants;
