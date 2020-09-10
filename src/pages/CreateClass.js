import React, { useState } from "react";

const CreateClass = () => {
  const [classInfo, setClassInfo] = useState({
    classTitle: "",
    classDescription: "",
    classSection: "",
    classSubject: "",
  });
  //   TODO: add it to database

  const handleChange = (name) => (event) => {
    setClassInfo({ ...classInfo, [name]: event.target.value });
  };

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
              <div className="waves-effect disabled waves-light btn-large">
                Class Name is required
              </div>
            ) : (
              <div className="waves-effect waves-light btn-large">
                Create Class
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateClass;
