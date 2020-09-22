import React, { useEffect } from "react";

// import firebase from "firebase/app";
// import "firebase/firestore";
// /// no use
import M from "materialize-css/dist/js/materialize.min.js";

const TestTabs = ({ allStudent, testInfo }) => {
  // const [testInfo, setTestInfo] = useState({});

  useEffect(() => {
    var elems = document.querySelectorAll(".tabs");
    M.Tabs.init(elems, {});
    return () => {};
  }, []);

  // useEffect(() => {
  //   // console.log(allStudent);
  //   if (testId) {
  //     var unsubscribe = firebase
  //       .firestore()
  //       .collection("tests")
  //       .doc(testId)
  //       .onSnapshot(
  //         (querySnapshot) => {
  //           setTestInfo(querySnapshot.data());
  //         },
  //         (err) => {
  //           console.log(err);
  //         }
  //       );
  //   }
  //
  //   return () => {
  //     if (testId) {
  //       unsubscribe();
  //     }
  //   };
  // }, [testId]);

  return (
    <div className=" scroll">
      <div className="row">
        <ul className="tabs tabs-fixed-width tab-demo">
          <li className="tab">
            <a href="#AllStudents">
              All Students ( {(allStudent && allStudent.length) || 0} )
            </a>
          </li>
          <li className="tab">
            <a href="#Presents" className="active">
              Presents ({" "}
              {(testInfo.presentStudents && testInfo.presentStudents.length) ||
                0}{" "}
              )
            </a>
          </li>
          <li className="tab">
            <a href="#Absents">
              Absents ({" "}
              {(testInfo.absentStudents && testInfo.absentStudents.length) || 0}{" "}
              )
            </a>
          </li>
        </ul>
        <div id="AllStudents" className="col fg-Background m4 offset-m4 mt-20">
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
                  <h5 className="title secondary mt-0">
                    {student.studentName}
                  </h5>
                  {/* <p>First Line</p> */}
                </li>
              ))
            ) : (
              <h4 className="center-align grey-text">No Students</h4>
            )}
          </ul>
        </div>
        <div id="Presents" className="col fg-Background  m4 offset-m4 mt-20">
          <ul className="collection ">
            {testInfo &&
            testInfo.presentStudents &&
            testInfo.presentStudents.length > 0 ? (
              testInfo.presentStudents &&
              testInfo.presentStudents.map((student, index) => (
                <li key={index} className="collection-item avatar">
                  <img
                    src={
                      student.studentPhotoUrl ||
                      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                    }
                    alt="student"
                    className="circle"
                  />
                  <h5 className="title secondary mt-0">
                    {student.studentName}
                  </h5>
                  {/* <p>First Line</p> */}
                </li>
              ))
            ) : (
              <h4 className="center-align grey-text">No Students</h4>
            )}
          </ul>
        </div>
        <div id="Absents" className="col fg-Background m4 offset-m4 mt-20">
          <ul className="collection">
            {testInfo &&
            testInfo.absentStudents &&
            testInfo.absentStudents.length > 0 ? (
              testInfo.absentStudents &&
              testInfo.absentStudents.map((student, index) => (
                <li key={index} className="collection-item avatar">
                  <img
                    src={
                      student.studentPhotoUrl ||
                      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                    }
                    alt="student"
                    className="circle"
                  />
                  <h5 className="title secondary mt-0">
                    {student.studentName}
                  </h5>
                  {/* <p>First Line</p> */}
                </li>
              ))
            ) : (
              <h4 className="center-align grey-text">No Students</h4>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestTabs;
