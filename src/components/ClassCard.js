import React from "react";
import { Link } from "react-router-dom";

const ClassCard = ({ classInfo }) => {
  return (
    <div>
      <div className="card">
        <div className="card-image waves-effect waves-block waves-light">
          {/* <img class="activator" src="images/office.jpg"/> */}
          <div className={`card-design bg-${Math.floor(Math.random() * 10)}`}>
            <span
              style={{ fontWeight: "bold" }}
              className="card-title capitalize bold"
            >
              {classInfo.title}
            </span>
          </div>
        </div>
        <div className="card-content">
          <span
            className="card-title activator bold"
            style={{ fontWeight: "bold" }}
          >
            {classInfo.subject}
            <i className="material-icons right">more_vert</i>
          </span>
          <p>
            <Link to={`/class/${classInfo.code}`}>Go to Class</Link>
          </p>
        </div>
        <div className="card-reveal">
          <span className="card-title primary capitalize">
            {classInfo.title}
            <i className="material-icons right">close</i>
          </span>
          <div>
            <table className="striped mt-10">
              <tbody>
                <tr>
                  <td style={{ padding: "5px 5px" }}>Class Name</td>
                  <td style={{ padding: "5px 5px" }}> : </td>
                  <td style={{ padding: "5px 5px" }}>{classInfo.title}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 5px" }}> Teacher</td>
                  <td style={{ padding: "5px 5px" }}> : </td>
                  <td style={{ padding: "5px 5px" }}>{classInfo.teacher}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 5px" }}>Subject</td>
                  <td style={{ padding: "5px 5px" }}> : </td>
                  <td style={{ padding: "5px 5px" }}>{classInfo.subject}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 5px" }}>Section</td>
                  <td style={{ padding: "5px 5px" }}> : </td>
                  <td style={{ padding: "5px 5px" }}>{classInfo.section}</td>
                </tr>
                <tr>
                  <td style={{ padding: "5px 5px" }}>Code</td>
                  <td style={{ padding: "5px 5px" }}> : </td>
                  <td style={{ padding: "5px 5px" }}>{classInfo.code}</td>
                </tr>
              </tbody>
            </table>
            <Link className="right mt-10" to={`/class/${classInfo.code}`}>
              Go to Class
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
