import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
import { ProgressBar } from "react-materialize";
import { FaFileImage, FaFilePdf } from "react-icons/fa";

const CreateAnnouncement = ({ state, classCode }) => {
  const [announcement, setAnnouncement] = useState("");
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState([]);

  var tempfiles;

  const fileHandler = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file && !file.type) {
        // eslint-disable-next-line
        throw "File error";
      }
      var metadata = {
        contentType: file.type, /// gives the file pdf
      };

      setProgress(0);

      const storageRef = await firebase.storage().ref();

      var uploadTask = storageRef
        .child(`teacher/announcement/` + file.name + nanoid(10))
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
      .collection("announcement")
      .doc(code)
      .set({
        announcementTitle: title,
        announcementDetails: announcement,
        announcementFiles: files,
        classCode: classCode,
        teacher: state.user.displayName,
        announcementId: code,
      })
      .then(() => {
        toast.success("Successfully created");
        setAnnouncement("");
        setFiles([]);
        setTitle("");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to create, Please Try Again");
      });
  };

  return (
    <div className="container">
      <form className="my-20 p-box">
        {/* /// title */}
        <div className="input-field">
          <input
            id="title"
            type="text"
            required
            className="validate"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <label htmlFor="title">Assignment Title</label>
        </div>

        {/* /// announcement */}
        <div className="input-field">
          <textarea
            id="announcement"
            value={announcement}
            onChange={(event) => {
              setAnnouncement(event.target.value);
            }}
            className="materialize-textarea"
          ></textarea>
          <label htmlFor="announcement">Announcement Description</label>
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
                      {pdf.pdfName.slice(-3) === "pdf" ? (
                        <FaFilePdf size={30} className="left" color="red" />
                      ) : (
                        <FaFileImage size={30} className="left" color="blue" />
                      )}
                      <h5 className="valign-wrapper">
                        {pdf.pdfName.slice(0, -4)}
                      </h5>
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

        <div className="center-align">
          {announcement && !isUploading ? (
            <span
              className="waves-effect waves-light btn-large "
              onClick={onSubmit}
            >
              Create Announcement
            </span>
          ) : (
            <span className="waves-effect disabled waves-light btn-large ">
              Create Announcement
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
