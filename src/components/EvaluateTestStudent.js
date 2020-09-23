import React, { useContext, useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import { FaFilePdf } from "react-icons/fa";
import { UserContext } from "../context/Context";
import M from "materialize-css/dist/js/materialize.min.js";
import { toast } from "react-toastify";

const EvaluateTestStudent = ({ student }) => {
  const [testSubmittionInfo, setTestSubmittionInfo] = useState({});
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");

  const { state } = useContext(UserContext);

  useEffect(() => {
    student.submittionId &&
      firebase
        .firestore()
        .collection("submittedTest")
        .doc(student.submittionId)
        .get()
        .then((doc) => {
          setTestSubmittionInfo(doc.data());
          setGrade(doc.data().marks || "");
          M.updateTextFields();
        })
        .catch((err) => {
          console.log(err);
        });
    return () => {};
  }, [student.submittionId]);

  const onSubmit = (event) => {
    event.preventDefault();

    var db = firebase.firestore();
    if (grade) {
      if (feedback) {
        db.collection("submittedTest")
          .doc(student.submittionId)
          .update({
            remark: firebase.firestore.FieldValue.arrayUnion({
              feedback: feedback,
              teacher: state.user.displayName,
              // date: firebase.firestore.FieldValue.serverTimestamp(),
            }),
            marks: grade,
          })
          .then(() => {
            var sfDocRef = db
              .collection("tests")
              .doc(testSubmittionInfo.testId);

            return db
              .runTransaction(function (transaction) {
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(sfDocRef).then(function (sfDoc) {
                  if (!sfDoc.exists) {
                    throw new Error("Document does not exist!");
                  }

                  var presentStudents = sfDoc.data().presentStudents;
                  var updatedpresentStudents = presentStudents.map(
                    (student) => {
                      if (student.studentId === testSubmittionInfo.studentId) {
                        // student.remark.length &&
                        //   student.remark.push({
                        //     feedback: feedback,
                        //     teacher: state.user.displayName,
                        //   });
                        return {
                          ...student,
                          // remark: student.remark
                          //   ? student.remark
                          //   : [
                          //       {
                          //         feedback: feedback,
                          //         teacher: state.user.displayName,
                          //       },
                          //     ],
                          marks: grade,
                        };
                      } else return student;
                    }
                  );

                  transaction.update(sfDocRef, {
                    presentStudents: updatedpresentStudents,
                  });
                });
              })
              .then(function () {
                console.log("Transaction successfully committed!");

                toast.success("Successfully Graded");
                // setGrade("");
                setFeedback("");
              })
              .catch(function (error) {
                console.log("Transaction failed: ", error);
                toast.error("Failed, Please Try Again");
              });
          })
          .catch((err) => {
            console.log(err);
            toast.error("Failed to Grade, Please try again");
          });
      } else {
        db.collection("submittedTest")
          .doc(student.submittionId)
          .update({
            marks: grade,
          })
          .then(() => {
            var sfDocRef = db
              .collection("tests")
              .doc(testSubmittionInfo.testId);

            return db
              .runTransaction(function (transaction) {
                // This code may get re-run multiple times if there are conflicts.
                return transaction.get(sfDocRef).then(function (sfDoc) {
                  if (!sfDoc.exists) {
                    throw new Error("Document does not exist!");
                  }

                  var presentStudents = sfDoc.data().presentStudents;
                  var updatedpresentStudents = presentStudents.map(
                    (student) => {
                      if (student.studentId === testSubmittionInfo.studentId) {
                        // student.remark.length &&
                        //   student.remark.push({
                        //     feedback: feedback,
                        //     teacher: state.user.displayName,
                        //   });
                        return {
                          ...student,
                          // remark: student.remark
                          //   ? student.remark
                          //   : [
                          //       {
                          //         feedback: feedback,
                          //         teacher: state.user.displayName,
                          //       },
                          //     ],
                          marks: grade,
                        };
                      } else return student;
                    }
                  );

                  transaction.update(sfDocRef, {
                    presentStudents: updatedpresentStudents,
                  });
                });
              })
              .then(function () {
                console.log("Transaction successfully committed!");

                toast.success("Successfully Graded");
                // setGrade("");
                setFeedback("");
              })
              .catch(function (error) {
                console.log("Transaction failed: ", error);
                toast.error("Failed, Please Try Again");
              });
          })
          .catch((err) => {
            console.log(err);
            toast.error("Failed to Grade, Please try again");
          });
      }
    } else {
      toast.warning("Grades is required");
    }
  };

  return (
    <div className="mt-20">
      {student === undefined ? (
        <h5 className="grey-text center-align mt-50">No Student Selected</h5>
      ) : (
        <div>
          <div className="center-align avatar">
            <img
              src={
                student.studentPhotoUrl ||
                "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
              }
              width={"20%"}
              alt="student"
              className="circle"
            />
            <h4 className="primary">{student.studentName}</h4>
          </div>

          {/* /// attachments */}
          <div className="mt-10">
            <ul className="collection with-header">
              {testSubmittionInfo &&
                testSubmittionInfo.AnswerFiles &&
                testSubmittionInfo.AnswerFiles.length > 0 && (
                  <li className="collection-header">
                    <h5 className="green-text">Work Attachments</h5>
                  </li>
                )}
              {testSubmittionInfo &&
                testSubmittionInfo.AnswerFiles &&
                testSubmittionInfo.AnswerFiles.map((pdf, index) => (
                  <li key={index} className="collection-item">
                    <div>
                      <a
                        href={pdf.pdfFile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFilePdf size={30} className="left" color="red" />
                        <span className="valign-wrapper">{pdf.pdfName}</span>
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
          </div>

          {/* /// Submition date */}
          {testSubmittionInfo && testSubmittionInfo.submittionDate && (
            <h6 className="orange-text mt-50">
              Submittion Date :
              <span className="ml-10 teal-text">{`${
                (new Date(
                  testSubmittionInfo.submittionDate.toDate()
                ).getHours() % 12 || "12") < 10
                  ? `0${
                      new Date(
                        testSubmittionInfo.submittionDate.toDate()
                      ).getHours() % 12 || "12"
                    }`
                  : new Date(
                      testSubmittionInfo.submittionDate.toDate()
                    ).getHours() % 12 || "12"
              } : ${
                new Date(
                  testSubmittionInfo.submittionDate.toDate()
                ).getMinutes() < 10
                  ? `0${new Date(
                      testSubmittionInfo.submittionDate.toDate()
                    ).getMinutes()}`
                  : new Date(
                      testSubmittionInfo.submittionDate.toDate()
                    ).getMinutes()
              } ${
                new Date(
                  testSubmittionInfo.submittionDate.toDate()
                ).getHours() >= 12
                  ? "PM"
                  : "AM"
              }`}</span>
              <span className="ml-10 light-blue-text">{`${new Date(
                testSubmittionInfo.submittionDate.toDate()
              ).getDate()} / ${new Date(
                testSubmittionInfo.submittionDate.toDate()
              ).getMonth()} / ${new Date(
                testSubmittionInfo.submittionDate.toDate()
              ).getFullYear()}`}</span>
            </h6>
          )}

          {testSubmittionInfo && testSubmittionInfo.studentMessage && (
            <h5 className="green-text mt-50">Answer :</h5>
          )}
          {testSubmittionInfo && testSubmittionInfo.studentMessage && (
            <blockquote>{testSubmittionInfo.studentMessage}</blockquote>
          )}

          {/* /// Remark */}
          <div className="fg-box">
            <div className="my-20 p-box">
              <form>
                <div className="input-field">
                  <textarea
                    id="Feedback"
                    className="materialize-textarea"
                    value={feedback}
                    onChange={(e) => {
                      setFeedback(e.target.value);
                    }}
                  ></textarea>
                  <label htmlFor="Feedback">Remark/feedback</label>
                </div>

                <div className="input-field">
                  <input
                    id="grade"
                    type="text"
                    className="validate"
                    value={grade}
                    onChange={(e) => {
                      setGrade(e.target.value);
                    }}
                  />
                  <label htmlFor="grade">Grade</label>
                </div>

                <div className="center-align">
                  {feedback || grade ? (
                    <span
                      className="waves-effect large waves-light btn center center-align"
                      onClick={onSubmit}
                    >
                      Send
                    </span>
                  ) : (
                    <span className="waves-effect large waves-light btn center-align disabled">
                      Send
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluateTestStudent;
