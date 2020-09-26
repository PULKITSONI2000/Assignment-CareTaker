import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { Col, Row } from "react-materialize";

import { FaFileImage, FaFilePdf } from "react-icons/fa";

import M from "materialize-css/dist/js/materialize.min.js";
import EvaluateTestStudent from "../components/EvaluateTestStudent";

const ViewTestReport = ({ match }) => {
  const [testInfo, setTestInfo] = useState({});
  const [classInfo, setClassInfo] = useState({});
  const [studentToEvaluate, setStudentToEvaluate] = useState();

  useEffect(() => {
    var unsubscribe = firebase
      .firestore()
      .collection("tests")
      .doc(match.params.testId)
      .onSnapshot(
        (querySnapshot) => {
          setTestInfo(querySnapshot.data());
        },
        (err) => {
          console.log(err);
        }
      );

    var elemstabs = document.querySelectorAll(".tabs");
    M.Tabs.init(elemstabs, {});

    return () => {
      setTestInfo({});
      unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    testInfo.classCode &&
      firebase
        .firestore()
        .collectionGroup("classes")
        .where("code", "==", testInfo.classCode)
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
  }, [testInfo.classCode]);

  return (
    <div>
      <Row>
        <Col s={12} l={3} className="scroll">
          <div>
            <ul className="tabs tabs-fixed-width ">
              <li className="tab col s3">
                <a href="#AlltestStudents">
                  {" "}
                  All Students ({" "}
                  {(classInfo.students && classInfo.students.length) || 0} )
                </a>
              </li>
              <li className="tab col s3">
                <a href="#testPresents" className="active">
                  {" "}
                  Presents ({" "}
                  {(testInfo.presentStudents &&
                    testInfo.presentStudents.length) ||
                    0}
                </a>
              </li>
              <li className="tab col s3">
                <a href="#testAbsents">
                  Absents ({" "}
                  {(testInfo.absentStudents &&
                    testInfo.absentStudents.length) ||
                    0}
                </a>
              </li>
            </ul>
          </div>
          <div id="AlltestStudents" className="col s12">
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
                  </li>
                ))
              ) : (
                <h4 className="center-align grey-text">No Students</h4>
              )}
            </ul>
          </div>
          <div id="testPresents" className="col s12">
            <ul className="collection pointer">
              {testInfo &&
              testInfo.presentStudents &&
              testInfo.presentStudents.length > 0 ? (
                testInfo.presentStudents &&
                testInfo.presentStudents.map((student, index) => (
                  <li
                    key={index}
                    className="collection-item avatar"
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
                      <span className="right orange-text">{student.marks}</span>
                    </h5>
                  </li>
                ))
              ) : (
                <h4 className="center-align grey-text">No Students</h4>
              )}
            </ul>
          </div>
          <div id="testAbsents" className="col s12">
            <ul className="collection">
              {testInfo &&
              testInfo.absentStudents &&
              testInfo.absentStudents.length > 0 ? (
                testInfo.absentStudents &&
                testInfo.absentStudents.map((student, index) => (
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
                  </li>
                ))
              ) : (
                <h4 className="center-align grey-text">No Students</h4>
              )}
            </ul>
          </div>
        </Col>

        <Col s={12} l={5}>
          <div className="scroll">
            <h2 className="underline primary bold capitalize">
              {testInfo.testName}
            </h2>

            <blockquote className="flow-text mt-50 ">
              {testInfo.testDescription}
            </blockquote>

            {testInfo.startDate && (
              <h6 className="mt-50 orange-text">
                Start Data :
                <span className="ml-10 teal-text">{`${
                  (new Date(testInfo.startDate.toDate()).getHours() % 12 ||
                    "12") < 10
                    ? `0${
                        new Date(testInfo.startDate.toDate()).getHours() % 12 ||
                        "12"
                      }`
                    : new Date(testInfo.startDate.toDate()).getHours() % 12 ||
                      "12"
                } : ${
                  new Date(testInfo.startDate.toDate()).getMinutes() < 10
                    ? `0${new Date(testInfo.startDate.toDate()).getMinutes()}`
                    : new Date(testInfo.startDate.toDate()).getMinutes()
                } ${
                  new Date(testInfo.startDate.toDate()).getHours() >= 12
                    ? "PM"
                    : "AM"
                }`}</span>
                <span className="ml-10 light-blue-text">{`${new Date(
                  testInfo.startDate.toDate()
                ).getDate()} / ${new Date(
                  testInfo.startDate.toDate()
                ).getMonth()} / ${new Date(
                  testInfo.startDate.toDate()
                ).getFullYear()}`}</span>
              </h6>
            )}
            {testInfo.endDate && (
              <h6 className="mt-20 orange-text">
                End Data :
                <span className="ml-10 teal-text">{`${
                  (new Date(testInfo.endDate.toDate()).getHours() % 12 ||
                    "12") < 10
                    ? `0${
                        new Date(testInfo.endDate.toDate()).getHours() % 12 ||
                        "12"
                      }`
                    : new Date(testInfo.endDate.toDate()).getHours() % 12 ||
                      "12"
                } : ${
                  new Date(testInfo.endDate.toDate()).getMinutes() < 10
                    ? `0${new Date(testInfo.endDate.toDate()).getMinutes()}`
                    : new Date(testInfo.endDate.toDate()).getMinutes()
                } ${
                  new Date(testInfo.endDate.toDate()).getHours() >= 12
                    ? "PM"
                    : "AM"
                }`}</span>
                <span className="ml-10 light-blue-text">{`${new Date(
                  testInfo.endDate.toDate()
                ).getDate()} / ${new Date(
                  testInfo.endDate.toDate()
                ).getMonth()} / ${new Date(
                  testInfo.endDate.toDate()
                ).getFullYear()}`}</span>
              </h6>
            )}

            {/* /// attachments */}
            <div className="mt-10 mb-30">
              {testInfo.testFiles && testInfo.testFiles.length > 0 && (
                <ul className="collection with-header">
                  {testInfo.testFiles && testInfo.testFiles.length > 0 && (
                    <li className="collection-header">
                      <h5 className="green-text">Attachments</h5>
                    </li>
                  )}
                  {testInfo.testFiles &&
                    testInfo.testFiles.map((pdf, index) => (
                      <li key={index} className="collection-item">
                        <div>
                          <a
                            href={pdf.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {pdf.pdfName.slice(-3) === "pdf" ? (
                              <FaFilePdf
                                size={30}
                                className="left"
                                color="red"
                              />
                            ) : (
                              <FaFileImage
                                size={30}
                                className="left"
                                color="blue"
                              />
                            )}
                            <h5 className="valign-wrapper">
                              {pdf.pdfName.slice(0, -4)}
                            </h5>
                          </a>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </Col>

        <Col s={12} l={4}>
          <div className="scroll">
            {studentToEvaluate ? (
              <EvaluateTestStudent student={studentToEvaluate} />
            ) : (
              <h5 className="grey-text center-align mt-50">
                No Student Selected
              </h5>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ViewTestReport;
