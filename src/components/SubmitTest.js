import React, { useContext, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import firebase from "firebase/app";
import "firebase/firestore";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { UserContext } from "../context/Context";
import Timer from "./Timer";

const SubmitTest = ({ testInfo }) => {
  const { state } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

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
          `student/test/${testInfo.classCode}/${testInfo.testName}` +
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
              ///
              setFiles(files);
            })
            .catch((err) => console.log(err));
        }
      );

      setFiles(tempfiles);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const onSubmit = () => {
    try {
      if (testInfo.endDate.toDate() < new Date()) {
        // eslint-disable-next-line
        throw "Time's up you Miss tha test";
      }

      var db = firebase.firestore();
      const code = nanoid(14);

      db.collection("submittedTest")
        .doc(code)
        .set({
          studentId: state.user.uid,
          studentName: state.user.displayName,
          studentPhotoUrl: state.user.photoURL,
          studentMessage: message,
          AnswerFiles: files,

          testId: testInfo.testId,
          classCode: testInfo.classCode,
          endDate: testInfo.endDate,
          submittionDate: firebase.firestore.FieldValue.serverTimestamp(),
          teacherId: testInfo.teacherId,
        })
        .then(() => {
          var sfDocRef = db.collection("tests").doc(testInfo.testId);
          return db
            .runTransaction(function (transaction) {
              return transaction.get(sfDocRef).then(function (sfDoc) {
                if (!sfDoc.exists) {
                  // eslint-disable-next-line
                  throw "Document does not exist!";
                }
                transaction.update(sfDocRef, {
                  presentStudents: firebase.firestore.FieldValue.arrayUnion({
                    studentId: state.user.uid,
                    studentName: state.user.displayName,
                    studentPhotoUrl: state.user.photoURL,
                    submittionId: code,
                  }),
                });
                transaction.update(sfDocRef, {
                  absentStudents: firebase.firestore.FieldValue.arrayRemove({
                    studentId: state.user.uid,
                    studentName: state.user.displayName,
                    studentPhotoUrl: state.user.photoURL,
                  }),
                });
              });
            })
            .then(function () {
              toast.success("Test Submitted");
              setMessage("");
              setFiles("");
            })
            .catch(function (error) {
              console.log("Transaction failed: ", error);
              toast.error("Please Try again");
            });
        })
        .catch((err) => {
          console.log(err);
          toast.error(`failed, ${err}`);
        });
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="fg-box mt-20 container">
      <div className="p-box">
        <h5 className="primary">
          Time Left :-{" "}
          {testInfo.endDate && <Timer endTime={testInfo.endDate.toDate()} />}
        </h5>
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
                      <FaFilePdf size={30} className="left" color="red" />
                      <span className="valign-wrapper">{pdf.pdfName}</span>
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
            id="AnswerTextarea"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            className="materialize-textarea"
          ></textarea>
          <label htmlFor="AnswerTextarea">Private Message</label>
        </div>

        <div className="center-align">
          {!isUploading && (files.length > 0 || message) ? (
            <span
              className="waves-effect waves-light btn-large "
              onClick={onSubmit}
            >
              Submit
            </span>
          ) : (
            <span className="waves-effect disabled waves-light btn-large ">
              Submit
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitTest;
