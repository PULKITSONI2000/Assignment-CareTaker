import React, { useContext, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import firebase from "firebase/app";
import "firebase/firestore";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { UserContext } from "../context/Context";

const SubmitTest = ({ testInfo }) => {
  const { state } = useContext(UserContext);

  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  var tempfiles = [];

  const fileHandler = async (e) => {
    try {
      console.log(e.target.files);
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
    var db = firebase.firestore();
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
              studentMessage: message,
              AnswerFiles: files,
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
  };

  return (
    <div className="fg-box container">
      <div className="p-box">
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
