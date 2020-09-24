import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { FaFilePdf } from "react-icons/fa";

import { nanoid } from "nanoid";
import {
  Col,
  DatePicker,
  ProgressBar,
  Row,
  TimePicker,
} from "react-materialize";
import { toast } from "react-toastify";

const AddAssignment = ({ state, classCode }) => {
  const [assignmentName, setassignmentName] = useState("");
  const [assignmentDueDate, setassignmentDueDate] = useState(false);
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [success, setSuccess] = useState(false);

  var tempfiles;

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
        .child(`teacher/assignments/` + file.name + nanoid(10))
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

  const onSubmit = (event) => {
    event.preventDefault();
    const code = nanoid(14);

    firebase
      .firestore()
      .collection("user")
      .doc(state.user.uid)
      .collection("classes")
      .doc(classCode)
      .collection("assignment")
      .doc(code)
      .set({
        name: assignmentName,
        description: assignmentDescription,
        dueDate: firebase.firestore.Timestamp.fromDate(
          new Date(assignmentDueDate)
        ),
        assignmentFiles: files,
        classCode: classCode,
        assignmentId: code,
        teacherId: state.user.uid,
      })
      .then(() => {
        setSuccess(`Successfully Uploaded Assignment : ${assignmentName}`);
        toast.success("Successfully Uploaded Assignment");
        setAssignmentDescription("");
        setassignmentDueDate(false);
        setFiles([]);
        setassignmentName("");
        setIsUploading(false);
        setProgress(0);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  return (
    <div className="container ">
      {/* {console.log("files", files)} */}
      <form className="my-20 p-box">
        <h5 className="center-align green-text">{success}</h5>

        {/* /// Name */}
        <div className="input-field">
          <input
            id="assignmentName"
            type="text"
            required
            className="validate"
            value={assignmentName}
            onChange={(event) => {
              setassignmentName(event.target.value);
            }}
          />
          <label htmlFor="assignmentName">Assignment Name</label>
        </div>

        {/*/// Description */}
        <div>
          <div className="input-field">
            <textarea
              id="textarea1"
              value={assignmentDescription}
              onChange={(event) => {
                setAssignmentDescription(event.target.value);
              }}
              className="materialize-textarea"
            />
            <label htmlFor="textarea1">Assignment Description</label>
          </div>
        </div>

        {progress !== 0 && progress !== 100 && (
          <ProgressBar className="container green-text" progress={progress} />
        )}

        {/* /// attachments */}
        <div className="mt-10 mb-30">
          <ul className="collection with-header">
            {files && files.length > 0 && (
              <li className="collection-header">
                <h5 className="green-text">Attachments ({files.length})</h5>
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

        {/* /// Files */}
        <div className="file-field input-field">
          <div className="btn">
            <span>File</span>
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

        {/* /// DueDate */}
        <div className="mt-20">
          <Row>
            <Col>
              <h6 className="secondary">Date :</h6>
              <DatePicker
                id="assignmentDueDate"
                options={{
                  autoClose: true,
                  defaultDate: new Date(),
                  firstDay: 0,
                  format: "dd mmm yyyy",
                  minDate: new Date(),
                }}
                onChange={(date) => {
                  setassignmentDueDate(date);
                }}
              />
            </Col>
            <Col>
              {assignmentDueDate && (
                <>
                  <h6 className="secondary">Time :</h6>

                  <TimePicker
                    id="assignmentDueTime"
                    onChange={(hour, minutes) => {
                      // console.log(hour, minutes);
                      assignmentDueDate && assignmentDueDate.setHours(hour);
                      assignmentDueDate &&
                        assignmentDueDate.setMinutes(minutes);
                    }}
                    options={{
                      twelveHour: false,
                    }}
                  />
                </>
              )}
            </Col>
          </Row>
        </div>

        <div className="center-align">
          {!isUploading && assignmentName && assignmentDueDate ? (
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
      </form>
    </div>
  );
};

export default AddAssignment;
