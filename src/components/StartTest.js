import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { FaFilePdf } from "react-icons/fa";

import { nanoid } from "nanoid";
import { UserContext } from "../context/Context";
import {
  Col,
  DatePicker,
  ProgressBar,
  Row,
  TimePicker,
} from "react-materialize";

const StartTest = ({ classInfo }) => {
  const { state } = useContext(UserContext);

  const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [testEndDate, setTestEndDate] = useState("");
  const [testStartDate, setTestStartDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  var tempfiles = [];

  useEffect(() => {
    return () => {
      setTestName("");
      setTestDescription("");
      setTestEndDate("");
      setTestStartDate("");
      setIsUploading(false);
      setProgress(0);
      setFiles([]);
    };
  }, []);

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
        .child(`teacher/tests/` + file.name + nanoid(10))
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
              setFiles(tempfiles);
              setIsUploading(false);
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
    try {
      event.preventDefault();
      const code = nanoid(14);

      var db = firebase.firestore();
      var batch = db.batch();

      if (new Date(testEndDate) <= new Date()) {
        // eslint-disable-next-line
        throw "End Date is Already expired";
      }
      if (new Date(testStartDate) <= new Date()) {
        // eslint-disable-next-line
        throw "You cannot create test in past";
      }

      batch.set(db.collection("tests").doc(code), {
        startDate: firebase.firestore.Timestamp.fromDate(
          new Date(testStartDate)
        ),
        endDate: firebase.firestore.Timestamp.fromDate(new Date(testEndDate)),
        testId: code,

        classCode: classInfo.code,
        teacherId: state.user.uid,

        presentStudents: [],
        absentStudents: classInfo.students || [],

        testName: testName,
        testDescription: testDescription,
        testFiles: files,
      });

      batch.update(
        db
          .collection("user")
          .doc(classInfo.teacherId)
          .collection("classes")
          .doc(classInfo.code),
        {
          tests: firebase.firestore.FieldValue.arrayUnion({
            testId: code,
            testName: testName,
            startDate: testStartDate.toString(),
            endDate: testEndDate.toString(),
          }),
        }
      );

      batch
        .commit()
        .then(() => {
          toast.success("Successfully Set Test");

          setTestName("");
          setTestDescription("");
          setTestEndDate("");
          setTestStartDate("");
          setIsUploading(false);
          setProgress(0);
          setFiles([]);
        })
        .catch((err) => {
          console.log(err);
          toast.error(err);
        });
    } catch (err) {
      console.log(err);
      toast.error(err);
    }
  };

  return (
    <div className="container fg-box">
      <div className="my-20 p-box">
        <h4 className="center primary bold mt-10">Create Test</h4>
        <form>
          {/* /// Name */}
          <div className="input-field">
            <input
              id="testName"
              type="text"
              required
              className="validate"
              value={testName}
              onChange={(event) => {
                setTestName(event.target.value);
              }}
            />
            <label htmlFor="testName">Test Name</label>
          </div>

          {/*/// Description */}
          <div>
            <div className="input-field">
              <textarea
                id="testtextarea1"
                value={testDescription}
                onChange={(event) => {
                  setTestDescription(event.target.value);
                }}
                className="materialize-textarea"
              />
              <label htmlFor="testtextarea1">Test Description</label>
            </div>
          </div>

          {progress !== 0 && progress !== 100 && (
            <ProgressBar className="container green-text" progress={progress} />
          )}

          {/* /// attachments */}
          {files && files.length > 0 && (
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
          )}

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

          {/* /// startDate */}
          <div className="mt-20">
            <Row>
              <Col>
                <h6 className="secondary">Start Date :</h6>
                <DatePicker
                  id="testStartDate"
                  options={{
                    autoClose: true,
                    defaultDate: new Date(),
                    firstDay: 0,
                    format: "dd mmm yyyy",
                    minDate: new Date(),
                  }}
                  onChange={(date) => {
                    setTestStartDate(date);
                  }}
                />
              </Col>
              <Col>
                {testStartDate && (
                  <>
                    <h6 className="secondary">Time :</h6>

                    <TimePicker
                      id="testStartTime"
                      onChange={(hour, minutes) => {
                        // console.log(hour, minutes);
                        testStartDate && testStartDate.setHours(hour);
                        testStartDate && testStartDate.setMinutes(minutes);
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
          {/* /// endDate */}
          <div className="mt-20">
            <Row>
              <Col>
                <h6 className="secondary">End Date :</h6>
                <DatePicker
                  id="testEndDate"
                  options={{
                    autoClose: true,
                    defaultDate: new Date(),
                    firstDay: 0,
                    format: "dd mmm yyyy",
                    minDate: new Date(),
                  }}
                  onChange={(date) => {
                    setTestEndDate(date);
                  }}
                />
              </Col>
              <Col>
                {testEndDate && (
                  <>
                    <h6 className="secondary">Time :</h6>

                    <TimePicker
                      id="testEndTime"
                      onChange={(hour, minutes) => {
                        // console.log(hour, minutes);
                        testEndDate && testEndDate.setHours(hour);
                        testEndDate && testEndDate.setMinutes(minutes);
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
            {!isUploading && testName && testStartDate && testEndDate ? (
              <span
                className="waves-effect waves-light btn-large "
                onClick={onSubmit}
              >
                Create test
              </span>
            ) : (
              <span className="waves-effect disabled waves-light btn-large ">
                Create test
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartTest;
