import React from "react";
import { Link } from "react-router-dom";

const ClassCard = ({ classInfo }) => {
  return (
    <div>
      <div className="card">
        <div className="card-image waves-effect waves-block waves-light">
          {/* <img class="activator" src="images/office.jpg"/> */}
          <div className="card-design">
            <span className="card-title">{classInfo.title}</span>
          </div>
        </div>
        <div className="card-content">
          <span className="card-title activator grey-text text-darken-4">
            {classInfo.subject}
            <i className="material-icons right">more_vert</i>
          </span>
          <p>
            <Link to={`/class/${classInfo.code}`}>Go to Class</Link>
          </p>
        </div>
        <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">
            {classInfo.title}
            <i className="material-icons right">close</i>
          </span>
          <p>
            {classInfo.subject && (
              <span>
                Subject : {classInfo.subject}
                <br />
              </span>
            )}
            {classInfo.teacher && (
              <span>
                Teacher : {classInfo.teacher}
                <br />
              </span>
            )}
            {classInfo.section && (
              <span>
                Section : {classInfo.section}
                <br />
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
