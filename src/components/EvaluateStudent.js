import React, { useContext, useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import { FaFilePdf } from "react-icons/fa";
import { UserContext } from "../context/Context";
import M from "materialize-css/dist/js/materialize.min.js";

const EvaluateStudent = ({ student }) => {
  const [assignmentInfo, setAssignmentInfo] = useState({});
  const [feedback, setFeedback] = useState("");
  const [grade, setGrade] = useState("");

  const { state } = useContext(UserContext);

  useEffect(() => {
    console.log(student);
    student &&
      firebase
        .firestore()
        .collection("SubmittedAssignment")
        .doc(student.submittionId)
        .get()
        .then((doc) => {
          console.log(doc.data());
          setAssignmentInfo(doc.data());
          setGrade(doc.data().marks || "");
          M.updateTextFields();
        })
        .catch((err) => {
          console.log(err);
        });
    return () => {};
  }, [student]);

  const onSubmit = (event) => {
    event.preventDefault();

    var db = firebase.firestore();

    /// update in SubmittedAssignment

    db.collection("SubmittedAssignment")
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
        console.log("Success");

        var sfDocRef = db
          .collection("user")
          .doc(assignmentInfo.teacherId)
          .collection("classes")
          .doc(assignmentInfo.classCode)
          .collection("assignment")
          .doc(assignmentInfo.assignmentId);

        return db
          .runTransaction(function (transaction) {
            // This code may get re-run multiple times if there are conflicts.
            return transaction.get(sfDocRef).then(function (sfDoc) {
              if (!sfDoc.exists) {
                throw new Error("Document does not exist!");
              }

              var studentSubmittion = sfDoc.data().studentSubmittion;
              var updatedSubmittion = studentSubmittion.map((student) => {
                if (student.studentId === assignmentInfo.studentId) {
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
              });

              transaction.update(sfDocRef, {
                studentSubmittion: updatedSubmittion,
              });
            });
          })
          .then(function () {
            console.log("Transaction successfully committed!");
            setGrade("");
            setFeedback("");
          })
          .catch(function (error) {
            console.log("Transaction failed: ", error);
          });
      })
      .catch((err) => {
        console.log(err);
      });

    /// update in class assignment
    // batch.update(
    //   db
    //     .collection("user")
    //     .doc(assignmentInfo.teacherId)
    //     .collection("classes")
    //     .doc(assignmentInfo.classCode)
    //     .collection("assignment")
    //     .doc(assignmentInfo.assignmentId),
    //   {
    //     studentSubmittion: firebase.firestore.FieldValue.arrayUnion({
    //       studentId: state.user.uid,
    //       studentName: state.user.displayName,
    //       studentPhotoUrl: state.user.photoURL,
    //       submittionId: code,
    //     }),
    //   }
    // );
  };

  return (
    <div className="mt-20">
      {student === undefined ? (
        <h5>No Student Selected</h5>
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
            <h4>{student.studentName}</h4>
          </div>
          {assignmentInfo.submittedMessage && (
            <h5 className="green-text mt-20">Answer :</h5>
          )}
          {assignmentInfo.submittedMessage && (
            <blockquote>{assignmentInfo.submittedMessage}</blockquote>
          )}
          {/* /// attachments */}
          <div className="mt-10">
            <ul className="collection with-header">
              {assignmentInfo.submittedPdfs &&
                assignmentInfo.submittedPdfs.length > 0 && (
                  <li className="collection-header">
                    <h5 className="green-text">Attachments</h5>
                  </li>
                )}
              {assignmentInfo.submittedPdfs &&
                assignmentInfo.submittedPdfs.map((pdf, index) => (
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

          {/* /// Remark */}
          <div>
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

              {feedback || grade ? (
                <span
                  className="waves-effect waves-light btn center-align"
                  onClick={onSubmit}
                >
                  Send
                </span>
              ) : (
                <span className="waves-effect waves-light btn center-align disabled">
                  Send
                </span>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluateStudent;
