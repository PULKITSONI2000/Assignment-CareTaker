import React, { useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import { nanoid } from "nanoid";

const CreateAnnouncement = ({ state, classCode }) => {
  const [announcement, setAnnouncement] = useState("");
  const [title, setTitle] = useState("");

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
        classCode: classCode,
        teacher: state.user.displayName,
        announcementId: code,
      })
      .then((result) => {
        console.log("Success", result);
        setAnnouncement("");
        setTitle("");

        // setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form>
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

        <div>
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
        </div>

        <div className="right-align">
          {announcement ? (
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
