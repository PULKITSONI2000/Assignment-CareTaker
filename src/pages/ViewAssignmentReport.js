import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { Col, Row } from "react-materialize";
import { FaFilePdf } from "react-icons/fa";

import M from "materialize-css/dist/js/materialize.min.js";
import EvaluateStudent from "../components/EvaluateStudent";

const ViewAssignmentReport = ({ match }) => {
  const [assignmentInfo, setAssignmentInfo] = useState({});
  const [classInfo, setClassInfo] = useState({});
  const [nonSubmitted, setNonSubmitted] = useState([]);
  const [studentToEvaluate, setStudentToEvaluate] = useState();

  useEffect(() => {
    var unsubscribe = firebase
      .firestore()
      .collectionGroup("assignment")
      .where("assignmentId", "==", match.params.assignmentId)
      .onSnapshot(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setAssignmentInfo(doc.data());
            // console.log("doc", doc.data());
          });
        },
        (err) => {
          console.log(err);
        }
      );
    var elems = document.querySelectorAll(".tabs");
    M.Tabs.init(elems, {});

    return () => {
      setAssignmentInfo({});
      unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    assignmentInfo.classCode &&
      firebase
        .firestore()
        .collectionGroup("classes")
        .where("code", "==", assignmentInfo.classCode)
        .orderBy("students")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setClassInfo(doc.data());
          });
        })
        .catch((err) => {
          console.log(err);
        });
  }, [assignmentInfo.classCode]);

  useEffect(() => {
    var tempNonSubmittion = [];
    classInfo.students &&
      classInfo.students.forEach((student) => {
        var isFound = false;
        assignmentInfo.studentSubmittion &&
          assignmentInfo.studentSubmittion.forEach((studentSubmit) => {
            if (student.studentId === studentSubmit.studentId) {
              isFound = true;
            }
          });
        if (!isFound) {
          tempNonSubmittion.push(student);
        }
      });
    setNonSubmitted(tempNonSubmittion);
    // eslint-disable-next-line
  }, [classInfo]);

  return (
    <div>
      <Row>
        <Col s={12} l={3}>
          <div className="scroll">
            <div className="mt-20">
              <ul className="tabs tabs-fixed-width tab-demo center ">
                <li className="tab">
                  <a href="#allstudents">
                    All Students (
                    {(classInfo.students && classInfo.students.length) || 0})
                  </a>
                </li>
                <li className="tab ">
                  <a href="#Submitted" className="active">
                    Submitted (
                    {(assignmentInfo.studentSubmittion &&
                      assignmentInfo.studentSubmittion.length) ||
                      0}
                    )
                  </a>
                </li>
                <li className="tab ">
                  <a href="#nonSubmitted">
                    non Submitted ({(nonSubmitted && nonSubmitted.length) || 0})
                  </a>
                </li>
              </ul>
            </div>

            <div id="allstudents" className="col s12">
              {/* /// All Students */}
              <ul className="collection">
                {classInfo.students && classInfo.students.length > 0 ? (
                  classInfo.students &&
                  classInfo.students.map((student, index) => (
                    <li key={index} className="collection-item avatar">
                      <img
                        src={
                          student.studentPhotoUrl ||
                          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                        }
                        alt="student"
                        className="circle"
                      />
                      <h5 className="title secondary mt-0">
                        {student.studentName}
                      </h5>
                      {/* <p>First Line</p> */}
                    </li>
                  ))
                ) : (
                  <h4 className="center-align grey-text">No Students</h4>
                )}
              </ul>
            </div>

            <div id="Submitted" className="col s12">
              {/* /// Submited */}
              <ul className="collection">
                {assignmentInfo.studentSubmittion &&
                assignmentInfo.studentSubmittion.length > 0 ? (
                  assignmentInfo.studentSubmittion &&
                  assignmentInfo.studentSubmittion.map((student, index) => (
                    <li
                      key={index}
                      className="collection-item avatar pointer"
                      onClick={() => {
                        setStudentToEvaluate(student);
                      }}
                    >
                      <img
                        src={
                          student.studentPhotoUrl ||
                          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                        }
                        alt="student"
                        className="circle"
                      />
                      <h5 className="title secondary mt-0">
                        {student.studentName}
                        <span className="right orange-text">
                          {student.marks}
                        </span>
                      </h5>
                      {/* <p>First Line</p> */}
                    </li>
                  ))
                ) : (
                  <h4 className="center-align grey-text">No Student</h4>
                )}
              </ul>
            </div>

            <div id="nonSubmitted" className="col s12">
              {/* /// nonSubmitted */}
              <ul className="collection">
                {nonSubmitted &&
                  (nonSubmitted && nonSubmitted.length > 0 ? (
                    nonSubmitted.map((student, index) => (
                      <li key={index} className="collection-item avatar">
                        <img
                          src={
                            student.studentPhotoUrl ||
                            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                          }
                          alt="student"
                          className="circle"
                        />
                        <h5 className="title secondary mt-0">
                          {student.studentName}
                        </h5>
                        {/* <p>First Line</p> */}
                      </li>
                    ))
                  ) : (
                    <h5 className="center-align grey-text">No Student</h5>
                  ))}
              </ul>
            </div>
          </div>
        </Col>
        <Col s={12} l={4}>
          <div className="scroll">
            <h2 className="underline primary bold capitalize">
              {assignmentInfo.name}
            </h2>

            <blockquote className="flow-text mt-50 ">
              {assignmentInfo.description}
            </blockquote>

            {assignmentInfo.dueDate && (
              <h6 className=" mt-50 orange-text">
                Due Data :
                <span className="ml-10 teal-text">{`${
                  (new Date(assignmentInfo.dueDate.toDate()).getHours() % 12 ||
                    "12") < 10
                    ? `0${
                        new Date(assignmentInfo.dueDate.toDate()).getHours() %
                          12 || "12"
                      }`
                    : new Date(assignmentInfo.dueDate.toDate()).getHours() %
                        12 || "12"
                } : ${
                  new Date(assignmentInfo.dueDate.toDate()).getMinutes() < 10
                    ? `0${new Date(
                        assignmentInfo.dueDate.toDate()
                      ).getMinutes()}`
                    : new Date(assignmentInfo.dueDate.toDate()).getMinutes()
                } ${
                  new Date(assignmentInfo.dueDate.toDate()).getHours() >= 12
                    ? "PM"
                    : "AM"
                }`}</span>
                <span className="ml-10 light-blue-text">{`${new Date(
                  assignmentInfo.dueDate.toDate()
                ).getDate()} / ${new Date(
                  assignmentInfo.dueDate.toDate()
                ).getMonth()} / ${new Date(
                  assignmentInfo.dueDate.toDate()
                ).getFullYear()}`}</span>
              </h6>
            )}

            {/* /// attachments */}
            <div className="mt-10 mb-30">
              {assignmentInfo.assignmentFiles &&
                assignmentInfo.assignmentFiles.length > 0 && (
                  <ul className="collection with-header">
                    {assignmentInfo.assignmentFiles &&
                      assignmentInfo.assignmentFiles.length > 0 && (
                        <li className="collection-header">
                          <h5 className="green-text">Attachments</h5>
                        </li>
                      )}
                    {assignmentInfo.assignmentFiles &&
                      assignmentInfo.assignmentFiles.map((pdf, index) => (
                        <li key={index} className="collection-item">
                          <div>
                            <a
                              href={pdf.pdfFile}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FaFilePdf
                                size={30}
                                className="left"
                                color="red"
                              />
                              <span className="valign-wrapper">
                                {pdf.pdfName}
                              </span>
                            </a>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
            </div>
          </div>
        </Col>
        <Col s={12} l={5}>
          <div className="scroll">
            <EvaluateStudent student={studentToEvaluate} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ViewAssignmentReport;
