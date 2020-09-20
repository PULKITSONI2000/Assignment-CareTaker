import React, { useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";

import M from "materialize-css/dist/js/materialize.min.js";

const AttendanceTabs = ({ allStudent, attendanceId }) => {
  const [attendenceInfo, setAttendenceInfo] = useState({});

  useEffect(() => {
    var elems = document.querySelectorAll(".tabs");
    M.Tabs.init(elems, {});
    return () => {};
  }, []);

  useEffect(() => {
    // console.log(allStudent);
    if (attendanceId) {
      var unsubscribe = firebase
        .firestore()
        .collection("attendence")
        .doc(attendanceId)
        .onSnapshot(
          (querySnapshot) => {
            setAttendenceInfo(querySnapshot.data());
          },
          (err) => {
            console.log(err);
          }
        );
    }

    return () => {
      if (attendanceId) {
        unsubscribe();
      }
    };
  }, [attendanceId]);

  return (
    <div className=" scroll">
      <ul className="tabs tabs-fixed-width tab-demo">
        <li className="tab">
          <a href="#AllStudents">
            All Students ( {(allStudent && allStudent.length) || 0} )
          </a>
        </li>
        <li className="tab">
          <a href="#Presents" className="active">
            Presents ({" "}
            {(attendenceInfo.presentStudents &&
              attendenceInfo.presentStudents.length) ||
              0}{" "}
            )
          </a>
        </li>
        <li className="tab">
          <a href="#Absents">
            Absents ({" "}
            {(attendenceInfo.absentStudents &&
              attendenceInfo.absentStudents.length) ||
              0}{" "}
            )
          </a>
        </li>
      </ul>
      <div id="AllStudents" className="col m4 offset-m4">
        <ul className="collection center">
          {allStudent && allStudent.length > 0 ? (
            allStudent &&
            allStudent.map((student, index) => (
              <li key={index} className="collection-item avatar">
                <img
                  src={
                    student.studentPhotoUrl ||
                    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  }
                  alt="student"
                  className="circle"
                />
                <h5 className="title secondary mt-0">{student.studentName}</h5>
                {/* <p>First Line</p> */}
              </li>
            ))
          ) : (
            <h4 className="center-align grey-text">No Students</h4>
          )}
        </ul>
      </div>
      <div id="Presents" className="col  m4 offset-m4">
        <ul className="collection">
          {attendenceInfo &&
          attendenceInfo.presentStudents &&
          attendenceInfo.presentStudents.length > 0 ? (
            attendenceInfo.presentStudents &&
            attendenceInfo.presentStudents.map((student, index) => (
              <li key={index} className="collection-item avatar">
                <img
                  src={
                    student.studentPhotoUrl ||
                    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  }
                  alt="student"
                  className="circle"
                />
                <h5 className="title secondary mt-0">{student.studentName}</h5>
                {/* <p>First Line</p> */}
              </li>
            ))
          ) : (
            <h4 className="center-align grey-text">No Students</h4>
          )}
        </ul>
      </div>
      <div id="Absents" className="col m4 offset-m4">
        <ul className="collection">
          {attendenceInfo &&
          attendenceInfo.absentStudents &&
          attendenceInfo.absentStudents.length > 0 ? (
            attendenceInfo.absentStudents &&
            attendenceInfo.absentStudents.map((student, index) => (
              <li key={index} className="collection-item avatar">
                <img
                  src={
                    student.studentPhotoUrl ||
                    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  }
                  alt="student"
                  className="circle"
                />
                <h5 className="title secondary mt-0">{student.studentName}</h5>
                {/* <p>First Line</p> */}
              </li>
            ))
          ) : (
            <h4 className="center-align grey-text">No Students</h4>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AttendanceTabs;
