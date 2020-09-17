import React, { useContext, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { UserContext } from "../context/Context";
import { nanoid } from "nanoid";
import { Redirect } from "react-router-dom";
import { ADD_CLASSES } from "../context/action.types";

const CreateClass = () => {
  const [classInfo, setClassInfo] = useState({
    classTitle: "",
    classDescription: "",
    classSection: "",
    classSubject: "",
  });
  const [success, setSuccess] = useState(false);

  const { state, dispatch } = useContext(UserContext);

  const handleChange = (name) => (event) => {
    setClassInfo({ ...classInfo, [name]: event.target.value });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const code = nanoid(10);

    firebase
      .firestore()
      .collection("user")
      .doc(state.user.uid)
      .collection("classes")
      .doc(code)
      .set({
        title: classInfo.classTitle,
        description: classInfo.classDescription,
        section: classInfo.classSection,
        subject: classInfo.classSubject,
        teacher: state.user.displayName,
        teacherId: state.user.uid,
        code: code,
      })
      .then((result) => {
        // console.log(result);
        dispatch({
          type: ADD_CLASSES,
          payload: {
            title: classInfo.classTitle,
            description: classInfo.classDescription,
            section: classInfo.classSection,
            subject: classInfo.classSubject,
            teacher: state.user.displayName,
            code: code,
          },
        });
        setSuccess(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (success) {
    return <Redirect to="/" />;
  }

  //   TODO: add it to database
  return (
    <div>
      <form className="row">
        <div className="col s6 offset-s3">
          <div className="input-field">
            <input
              id="classTitle"
              type="text"
              required
              value={classInfo.classTitle}
              onChange={handleChange("classTitle")}
              className="validate"
            />
            <label htmlFor="classTitle">Class Name*</label>
          </div>
          <div className="input-field">
            <textarea
              id="classDescription"
              value={classInfo.classDescription}
              onChange={handleChange("classDescription")}
              className="materialize-textarea"
            ></textarea>
            <label htmlFor="classDescription">Class Description</label>
          </div>
          <div className="input-field">
            <input
              id="classSubject"
              type="text"
              value={classInfo.classSubject}
              onChange={handleChange("classSubject")}
              className="validate"
            />
            <label htmlFor="classSubject">Class Subject</label>
          </div>
          <div className="input-field">
            <input
              id="classSection"
              type="text"
              value={classInfo.classSection}
              onChange={handleChange("classSection")}
              className="validate"
            />
            <label htmlFor="classSection">Class Section</label>
          </div>
          <div className="center-align">
            {classInfo.classTitle === "" ? (
              <button className="waves-effect disabled waves-light btn-large">
                Class Name is required
              </button>
            ) : (
              <button
                className="waves-effect waves-light btn-large"
                onClick={onSubmit}
              >
                Create Class
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateClass;
