import React, { useContext, useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { Col, Row } from "react-materialize";
import { FaFileImage, FaFilePdf } from "react-icons/fa";
import { nanoid } from "nanoid";
import { UserContext } from "../context/Context";
import { toast } from "react-toastify";

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

  var tempfiles = [];

  const fileHandler = async (e) => {
    try {
      const file = e.target.files[0];

      var metadata = {
        contentType: file.type, /// gives the file pdf
      };

      if (!file && !file.type) {
        // eslint-disable-next-line
        throw "File error";
      }

      setProgress(0);

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
              setIsUploading(true);
              break;
            default:
              console.log("Something went wrong in uploading");
          }
          if (progress === 100) {
            setIsUploading(false);
            toast.success("Successfully Uploaded");
          }
        },
        (error) => {
          setIsUploading(false);
          setProgress(0);
          console.log(error);
        },
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              tempfiles = files;
              tempfiles.push({
                pdfName: file.name,
                pdfFile: downloadURL,
              });
              // console.log("tempfiles", file.name);
              setFiles(tempfiles);
              setIsUploading(false);
              setProgress(0);
              ///
              setFiles(files);
            })
            .catch((err) => console.log(err));
        }
      );

      setFiles(tempfiles);
    } catch (error) {
      console.log(error);
      setProgress(0);
      toast.error(error);
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
        toast.success("Successfully Submitted your assignment");
        setMessage("");
        setFiles([]);
      })
      .catch((err) => {
        console.log("error : ", err);
        toast.error("Failed, Please Try Again");
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
        <Col s={12} m={8}>
          <h2 className="underline primary bold capitalize">
            {assignmentInfo.name}
          </h2>

          <blockquote className="flow-text mt-50 ">
            {assignmentInfo.description}
          </blockquote>

          {assignmentInfo.dueDate && (
            <h6 className="mt-50 orange-text ">
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

          {/* /// attachments */}
          <div className="mt-50">
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
        </Col>
        <Col s={12} m={4}>
          {isAssignmentSubmitted() ? (
            <div className="mt-20 ">
              <h4 className="center-align green-text valign-center">
                Work Already Submitted
              </h4>
              {/* {submittionInfo.remark} */}
              {submittionInfo.marks && (
                <h5 className="mt-20 secondary">
                  Grade : {submittionInfo.marks}
                </h5>
              )}
              {submittionInfo.remark && (
                <div>
                  {" "}
                  <div class="divider"></div>
                  <h5 className="left-align primary">Remarks :</h5>
                  {submittionInfo.remark.length > 0 && (
                    <ul className="collection">
                      {submittionInfo.remark.map((remark, index) => (
                        <li key={index} className="collection-item left-align">
                          <div>
                            {remark.feedback}
                            <span className="secondary-content grey-text">
                              ~{remark.teacher}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="fg-box mt-50">
              <div className="p-box">
                <h5 className="mt-20">Your Work</h5>

                {/* /// attachments */}
                <div>
                  <ul className="collection with-header">
                    {files && files.length > 0 && (
                      <li className="collection-header">
                        <h5 className="green-text">Attachments</h5>
                      </li>
                    )}
                    {files &&
                      files.map((pdf, index) => (
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
                </div>

                <div className="file-field input-field mt-20">
                  <div className="btn">
                    <span>Pdf</span>
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(event) => {
                        fileHandler(event);
                      }}
                    />
                  </div>
                  <div className="file-path-wrapper">
                    <input
                      className="file-path validate"
                      accept="application/pdf,image/*"
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
                      Submit Assignment
                    </span>
                  ) : (
                    <span className="waves-effect disabled waves-light btn-large ">
                      Submit Assignment
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ViewAssignment;
