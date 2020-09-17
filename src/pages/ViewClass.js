import React, { useContext, useEffect, useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import { UserContext } from "../context/Context";
import AddAssignment from "../components/AddAssignment";
import AllAssignmants from "../components/AllAssignmants";
import CreateAnnouncement from "../components/CreateAnnouncement";
import AllAnnouncements from "../components/AllAnnouncements";

import M from "materialize-css/dist/js/materialize.min.js";

const ViewClass = ({ match }) => {
  const [classInfo, setClassInfo] = useState({});

  const { state } = useContext(UserContext);

  useEffect(() => {
    // console.log(match.params.classcode);
    var unsubscribe = firebase
      .firestore()
      .collectionGroup("classes")
      .where("code", "==", match.params.classcode)
      .onSnapshot(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // console.log("doc", doc.data());
            setClassInfo(doc.data());
          });
        },
        (err) => {
          console.log(err);
        }
      );

    var elems = document.querySelectorAll(".tabs");
    M.Tabs.init(elems, {});

    return () => {
      unsubscribe();
      setClassInfo({});
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      {/* {console.log("yo", classInfo)} */}

      <div>
        <div className="class-box">
          <h2>{classInfo.title}</h2>
          {/* <p className="t-20">Teacher : {classInfo.teacher}</p>
          {classInfo.subject && <p>Subject : {classInfo.subject}</p>} */}
          {/* {classInfo.section && <p>Section : {classInfo.section}</p>} */}
          <p>
            Class Code :{" "}
            <span className="grey-text text-darken-2">{classInfo.code}</span>
          </p>
        </div>
      </div>

      <div className="mt-20">
        {/* /// Links */}
        <ul className="tabs tabs-fixed-width tab-demo z-depth-1 center">
          <li className="tab">
            <a href="#Assignments">Assignments</a>
          </li>

          <li className="tab">
            <a href="#Announcement">Announcement</a>
          </li>

          {state.teacher && (
            <li className="tab">
              <a href="#AddAssignment">Add Assignment</a>
            </li>
          )}

          {state.teacher && (
            <li className="tab">
              <a href="#CreateAnnouncement">Create Announcement</a>
            </li>
          )}
          <li className="tab">
            <a href="#AboutClass">About Class</a>
          </li>
        </ul>

        {/* /// Tabs */}
        <div id="Assignments">
          {
            state.user && classInfo.code && (
              <AllAssignmants classCode={classInfo.code} />
            )
            // console.log("Code ", classInfo.code)
          }
        </div>

        <div id="Announcement">
          {classInfo.code && (
            <AllAnnouncements
              isTeacher={state.teacher}
              classCode={classInfo.code}
              userId={state.user.uid}
            />
          )}
        </div>

        {state.teacher && (
          <div id="AddAssignment">
            {classInfo.code && (
              <AddAssignment state={state} classCode={classInfo.code} />
            )}
          </div>
        )}

        {state.teacher && (
          <div id="CreateAnnouncement">
            {classInfo.code && (
              <CreateAnnouncement state={state} classCode={classInfo.code} />
            )}
          </div>
        )}
        <div id="AboutClass">
          <div className="container">
            <table>
              <tbody>
                <tr>
                  <td>
                    <h5>Class Name</h5>
                  </td>
                  <td>
                    <h5> : </h5>
                  </td>
                  <td>
                    <h5>{classInfo.title}</h5>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Teacher</h5>
                  </td>
                  <td>
                    <h5> : </h5>
                  </td>
                  <td>
                    <h5>{classInfo.teacher}</h5>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Subject</h5>
                  </td>
                  <td>
                    <h5> : </h5>
                  </td>
                  <td>
                    <h5>{classInfo.subject}</h5>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Section</h5>
                  </td>
                  <td>
                    <h5> : </h5>
                  </td>
                  <td>
                    <h5>{classInfo.section}</h5>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h5>Code</h5>
                  </td>
                  <td>
                    <h5> : </h5>
                  </td>
                  <td>
                    <h5>{classInfo.code}</h5>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewClass;
