import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";

import { nanoid } from "nanoid";
import {
  Col,
  DatePicker,
  ProgressBar,
  Row,
  TimePicker,
} from "react-materialize";

const AddAssignment = () => {
  const [assignmentName, setassignmentName] = useState("");
  const [assignmentDueDate, setassignmentDueDate] = useState(false);
  const [assignmentDescription, setAssignmentDescription] = useState("");
  // const [error, setError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  const fileHandler = async (e) => {
    try {
      const file = e.target.files[0];

      var metadata = {
        contentType: file.type, /// gives the file pdf
      };

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
              setIsUploading(false);
              var tempfiles = files;
              tempfiles.push(downloadURL);
              setFiles(tempfiles);
            })
            .catch((err) => console.log(err));
        }
      );
    } catch (error) {}
  };

  return (
    <div>
      <form>
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
            ></textarea>
            <label htmlFor="textarea1">Textarea</label>
          </div>
        </div>

        {/* /// DueDate */}
        <div>
          <Row>
            <Col>
              <h6>Date :</h6>
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
                  <h6>Time :</h6>

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

        {isUploading && <ProgressBar progress={progress} />}
        {/* Files */}
        <div className="file-field input-field">
          <div className="btn">
            <span>File</span>
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
        {console.log(files)}
      </form>
    </div>
  );
};

export default AddAssignment;
