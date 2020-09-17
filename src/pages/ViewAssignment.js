import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { Col, Row } from "react-materialize";
import { FaFilePdf } from "react-icons/fa";
import { nanoid } from "nanoid";
import { UserContext } from "../context/Context";

const ViewAssignment = ({ match }) => {
  const [assignmentInfo, setAssignmentInfo] = useState({});
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [submittionInfo, setSubmittionInfo] = useState({});

  const { state } = useContext(UserContext);

  useEffect(() => {
    firebase
      .firestore()
      .collectionGroup("assignment")
      .where("assignmentId", "==", match.params.assignmentId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setAssignmentInfo(doc.data());
          // console.log("doc", doc.data());
        });
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      setAssignmentInfo({});
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    var submittionId = false;
    assignmentInfo.studentSubmittion &&
      assignmentInfo.studentSubmittion.forEach(
        (submittion) =>
          submittion.studentId === state.user.uid &&
          (submittionId = submittion.submittionId)
      );
    if (submittionId) {
      firebase
        .firestore()
        .collection("SubmittedAssignment")
        .doc(submittionId)
        .get()
        .then((result) => {
          setSubmittionInfo(result.data());
          console.log("result", result.data());
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      setSubmittionInfo({});
    };
    // eslint-disable-next-line
  }, [assignmentInfo.studentSubmittion]);

  const fileHandler = async (e) => {
    try {
      const file = e.target.files[0];

      var metadata = {
        contentType: file.type, /// gives the file pdf
      };

      const storageRef = await firebase.storage().ref();

      var uploadTask = storageRef
        .child(
          `student/assignment/${assignmentInfo.classCode}/${assignmentInfo.name}` +
            file.name +
            nanoid(10)
        )
        .put(file, metadata);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          setIsUploading(true);

          /// can be used with preloader to give live feedback of uploading

          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              setIsUploading(false);
              console.log("UPloading is paused");
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log("UPloading is in progress...");
              break;
            default:
              console.log("Something went wrong in uploading");
          }
          if (progress === 100) {
            setIsUploading(false);
            // toast("Successfully Uploaded", { type: "success" });
          }
        },
        (error) => {
          setIsUploading(false);
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              var tempfiles = files;
              tempfiles.push({
                pdfName: file.name,
                pdfFile: downloadURL,
              });
              console.log("downloadURL", tempfiles);
              setFiles(tempfiles);
              setIsUploading(false);
            })
            .catch((err) => console.log(err));
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const code = nanoid(14);

    var db = firebase.firestore();
    var batch = db.batch();
    ///
    batch.set(db.collection("SubmittedAssignment").doc(code), {
      submittedPdfs: files,
      submittedMessage: message,
      classCode: assignmentInfo.classCode,
      dueDate: assignmentInfo.dueDate,
      assignmentName: assignmentInfo.name,
      submittionId: code,
      assignmentId: assignmentInfo.assignmentId,
      teacherId: assignmentInfo.teacherId,
      studentId: state.user.uid,
      submittionDate: firebase.firestore.FieldValue.serverTimestamp(),
    });

    batch.update(
      db
        .collection("user")
        .doc(assignmentInfo.teacherId)
        .collection("classes")
        .doc(assignmentInfo.classCode)
        .collection("assignment")
        .doc(assignmentInfo.assignmentId),
      {
        studentSubmittion: firebase.firestore.FieldValue.arrayUnion({
          studentId: state.user.uid,
          studentName: state.user.displayName,
          studentPhotoUrl: state.user.photoURL,
          submittionId: code,
        }),
      }
    );

    batch
      .commit()
      .then((result) => {
        console.log("success : ", result);
        setMessage("");
        setFiles([]);
      })
      .catch((err) => {
        console.log("error : ", err);
      });
  };

  const isAssignmentSubmitted = () => {
    var result = false;
    assignmentInfo.studentSubmittion &&
      assignmentInfo.studentSubmittion.forEach(
        (submittion) =>
          submittion.studentId === state.user.uid && (result = true)
      );
    return result;
  };

  return (
    <div className="container">
      <Row>
        {console.log(assignmentInfo)}
        <Col s={12} m={9}>
          <h2 className="underline">{assignmentInfo.name}</h2>

          <blockquote className="flow-text mt-50 ">
            {assignmentInfo.description}
          </blockquote>

          {assignmentInfo.dueDate && (
            <h6 className="flow-text mt-50 ">
              Due Data :
              <span className="ml-10 teal-text">{`${
                (new Date(assignmentInfo.dueDate.toDate()).getHours() % 12 ||
                  "12") < 10
                  ? `0${
                      new Date(assignmentInfo.dueDate.toDate()).getHours() %
                        12 || "12"
                    }`
                  : new Date(assignmentInfo.dueDate.toDate()).getHours() % 12 ||
                    "12"
              } : ${
                new Date(assignmentInfo.dueDate.toDate()).getMinutes() < 10
                  ? `0${new Date(assignmentInfo.dueDate.toDate()).getMinutes()}`
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

          {/* <Row className="mt-50 ">
            {assignmentInfo.assignmentFiles &&
              assignmentInfo.assignmentFiles.map((pdf, index) => (
                <Col key={index}>
                  <a
                    href={pdf.pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFilePdf size={70} color="red" /> <br />
                    {pdf.pdfName}
                  </a>
                </Col>
              ))}
          </Row> */}

          {/* /// attachments */}
          <div className="mt-50">
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
                        <FaFilePdf size={30} className="left" color="red" />
                        <span className="valign-wrapper">{pdf.pdfName}</span>
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </Col>
        <Col s={12} m={3}>
          {isAssignmentSubmitted() ? (
            <div className="mt-20 ">
              <h4 className="center-align green-text valign-center">
                Work Already Submitted
              </h4>
              {/* {submittionInfo.remark} */}
              {submittionInfo.marks && (
                <h5 className="mt-20">Grade : {submittionInfo.marks}</h5>
              )}
              {submittionInfo.remark && submittionInfo.remark.length > 0 && (
                <ul className="collection">
                  {submittionInfo.remark.map((remark, index) => (
                    <li key={index} className="collection-item">
                      {remark.feedback}{" "}
                      <span className="grey-text right">~{remark.teacher}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <h5>Your Work</h5>

              <div className="file-field input-field">
                <div className="btn">
                  <span>Pdf</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      fileHandler(event);
                    }}
                  />
                </div>
                <div className="file-path-wrapper">
                  <input
                    className="file-path validate"
                    accept="application/pdf"
                    type="text"
                  />
                </div>
              </div>

              <div className="input-field">
                <textarea
                  id="textarea2"
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                  }}
                  className="materialize-textarea"
                ></textarea>
                <label htmlFor="textarea2">Private Message</label>
              </div>

              <div className="center-align">
                {!isUploading && (files.length > 0 || message) ? (
                  <span
                    className="waves-effect waves-light btn-large "
                    onClick={onSubmit}
                  >
                    Add Assignment
                  </span>
                ) : (
                  <span className="waves-effect disabled waves-light btn-large ">
                    Add Assignment
                  </span>
                )}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ViewAssignment;
