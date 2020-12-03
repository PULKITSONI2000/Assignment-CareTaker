import React, { useContext, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { BiBookAdd, BiMenu, BiLogIn } from "react-icons/bi";
import { RiLogoutBoxRLine } from "react-icons/ri";

// import Logo from "../images/Logo.png";

import firebase from "firebase/app";
import "firebase/firestore";

import M from "materialize-css/dist/js/materialize.min.js";

import { UserContext } from "../context/Context";
import { ADD_CLASSES, SET_TEACHER, SET_USER } from "../context/action.types";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#faeee7" };
  } else {
    return { color: "#f7d6bf" };
  }
};

var err;

const Header = ({ history }) => {
  const { state, dispatch } = useContext(UserContext);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [joinClassCode, setjoinClassCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [createTeacherError, setCreateTeacherError] = useState("");
  const [createTeacherResult, setCreateTeacherResult] = useState("");
  const [joinResult, setJoinResult] = useState("");

  const handleJoinClass = () => {
    if (!joinClassCode) {
      setJoinError("Please Enter Class Code");
    } else {
      // console.log(state.classes);
      var alreadyExist = false;
      state.classes &&
        state.classes.forEach((cls) => {
          cls.code === joinClassCode && (alreadyExist = cls.title);
        });
      alreadyExist
        ? setJoinError(`Already Joined  ${alreadyExist}`)
        : firebase
            .firestore()
            .collectionGroup("classes")
            .where("code", "==", joinClassCode)
            .get()
            .then((querySnapshot) => {
              var classInfo;
              querySnapshot.forEach((doc) => {
                classInfo = doc.data();
              });

              if (classInfo === undefined) {
                // eslint-disable-next-line
                throw `No class Exist with code ${joinClassCode}`;
              }
              firebase
                .firestore()
                .collection("user")
                .doc(classInfo.teacherId)
                .collection("classes")
                .doc(classInfo.code)
                .update({
                  students: firebase.firestore.FieldValue.arrayUnion({
                    studentId: state.user.uid,
                    studentName: state.user.displayName,
                    studentPhotoUrl: state.user.photoURL,
                  }),
                })
                .then(() => {
                  firebase
                    .firestore()
                    .collection("user")
                    .doc(state.user.uid)
                    .collection("JoinedClasses")
                    .add({
                      title: classInfo.title,
                      description: classInfo.description,
                      section: classInfo.section,
                      subject: classInfo.subject,
                      teacher: classInfo.teacher,
                      teacherId: classInfo.teacherId,
                      code: classInfo.code,
                      studentId: state.user.uid,
                    })
                    .then(() => {
                      dispatch({
                        type: ADD_CLASSES,
                        payload: classInfo,
                      });
                      setjoinClassCode("");
                      setJoinResult(
                        `Successfully Join class ${classInfo.title}`
                      );
                    })
                    .catch((err) => {
                      setJoinError(err);
                      // console.log(err);
                    });
                })
                .catch((err) => {
                  setJoinError(err);
                  // console.log(err);
                });
            })
            .catch((err) => {
              setJoinError(err);
              // console.log(err);
            });
    }
  };

  return (
    <div>
      <nav>
        {document.addEventListener("DOMContentLoaded", function () {
          var elems = document.querySelectorAll(".sidenav");
          M.Sidenav.init(elems, { preventScrolling: false });
        })}
        {document.addEventListener("DOMContentLoaded", function () {
          var elems = document.querySelectorAll(".modal");
          M.Modal.init(elems, {});
        })}
        <div className="nav-wrapper">
          <Link to={"/"} className="brand-logo center">
            {/* <img src={Logo} alt="" height="50px" style={{ marginTop: 5 }} /> */}
            Classes
          </Link>
          {/* /// Menu */}
          <span data-target="slide-out" className="sidenav-trigger">
            <BiMenu size={30} className="mt-10 pointer" />
          </span>

          {/* /// Navbar */}
          <ul id="nav-mobile" className="">
            {!state.user ? (
              /// Login
              <li className="right">
                <Link
                  className="valign-wrapper"
                  style={currentTab(history, "/login")}
                  to="/login"
                >
                  <span className="hide-on-small-only">Login</span>{" "}
                  <BiLogIn size={30} />
                </Link>
              </li>
            ) : (
              /// Signout
              <li
                className="right"
                onClick={() => {
                  firebase.auth().signOut();
                  dispatch({
                    type: SET_USER,
                    payload: false,
                  });
                  dispatch({
                    type: SET_TEACHER,
                    payload: false,
                  });
                }}
              >
                <Link to="/login" className="valign-wrapper">
                  <span className="waves-effect hide-on-small-only red-text">
                    Log Out
                  </span>
                  <BiLogIn
                    color="red"
                    className="hide-on-small-only"
                    size={30}
                  />
                  <BiLogIn
                    color="red"
                    className="mt-10 hide-on-med-and-up"
                    size={30}
                  />
                </Link>
              </li>
            )}
            {state.user.uid &&
              state.user.emailVerified &&
              (state.teacher ? (
                /// Create Class
                <li className="right">
                  <Link
                    className="valign-wrapper"
                    style={currentTab(history, "/class/create")}
                    to="/class/create"
                  >
                    <span className="hide-on-small-only">Create Class</span>
                    <BiBookAdd size={30} className="hide-on-small-only" />
                    <BiBookAdd size={30} className="mt-10 hide-on-med-and-up" />
                  </Link>
                </li>
              ) : (
                /// Join Class
                <li className="right">
                  <Link
                    to={"/"}
                    style={currentTab(history, "/class/join")}
                    data-target="joinClass"
                    className="valign-wrapper modal-trigger"
                  >
                    <span className="hide-on-small-only">Join Class</span>
                    <BiBookAdd size={30} className="hide-on-small-only" />
                    <BiBookAdd size={30} className="mt-10 hide-on-med-and-up" />
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </nav>

      {/* Join Class Modal */}
      <div id="joinClass" className="modal">
        <div className="modal-content">
          <h4 className="primary">Join Class</h4>

          <div className="row">
            <h5 className="secondary">Please Add Class Code</h5>
            <div className="input-field col s12">
              <input
                id="joinClass"
                value={joinClassCode}
                required
                onChange={(event) => {
                  setjoinClassCode(event.target.value);
                }}
                className="validate"
              />
              {/* <label htmlFor="joinClass">Class Code</label> */}
              <span
                className="helper-text"
                data-error="Please check the mail"
                data-success="right"
              >
                {joinError ? (
                  <h6 className="center-align red-text">{joinError}</h6>
                ) : (
                  "( eg - IRFa - VaY2b )"
                )}
              </span>
              <h6 className="center-align green-text">{joinResult}</h6>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn-flat red-text"
          >
            Close
          </a>
          <a
            href="#!"
            onClick={() => {
              handleJoinClass();
            }}
            className="waves-effect waves-green btn-flat green-text"
          >
            Add
          </a>
        </div>
      </div>

      {/* /// Side Nav */}
      <ul id="slide-out" className="sidenav">
        <li>
          <div className="user-view">
            <div className="background">
              {/* <img src="images/office.jpg" /> */}
            </div>
            {state.user && (
              <Link
                className="waves-effect right"
                onClick={() => {
                  firebase.auth().signOut();
                  dispatch({
                    type: SET_USER,
                    payload: false,
                  });
                }}
                to="/login"
              >
                <RiLogoutBoxRLine size={30} color="red" />
              </Link>
            )}
            <Link to={"/"}>
              {state.user && (
                // <img className="circle" alt="" src={state.user.photoURL} />
                <img
                  src={
                    state.user.photoURL ||
                    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                  }
                  width={"20%"}
                  alt="student"
                  className="circle"
                />
              )}
            </Link>
            <Link to={"/"}>
              {state.user && state.user.displayName && (
                <span className="white-text name">
                  {state.user.displayName}
                </span>
              )}
            </Link>
            <Link to={"/"}>
              {state.user && state.user.email && (
                <span className="white-text email">{state.user.email}</span>
              )}
            </Link>
          </div>
        </li>
        {state.user && (
          <li>
            <Link to={"/"}>Classes</Link>
          </li>
        )}
        {state.user && (
          <li>
            <Link to={"/notification"}>Notificaiton</Link>
          </li>
        )}
        {state.user && state.user.emailVerified && state.teacher && (
          <li>
            <Link to={"/class/create"}>Create Class</Link>
          </li>
        )}
        {state.user && state.user.emailVerified && state.teacher === false && (
          <li>
            <Link
              to={"/"}
              data-target="joinClass"
              className="valign-wrapper modal-trigger"
            >
              Join Class
            </Link>
          </li>
        )}
        {!state.user && (
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
        )}
        {!state.user && (
          <li>
            <Link to={"/signup"}>Sign Up</Link>
          </li>
        )}
        <li>
          <div className="divider"></div>
        </li>

        <li>
          {/* TODO: only for admin */}
          {/* {console.log(state)} */}
          {state.admin && state.user.emailVerified && (
            <Link to={"/"} data-target="addTeacher" className=" modal-trigger">
              Add Teacher
            </Link>
          )}
        </li>
      </ul>

      {/* Add Teacher Modal */}
      <div id="addTeacher" className="modal">
        <div className="modal-content">
          <h4 className="primary">Add Teacher</h4>
          <div className="row">
            <h5 className="secondary">Add Teacher Email Id</h5>
            <div className="input-field col s12">
              <input
                id="teacherEmail"
                type="email"
                required
                value={teacherEmail}
                onChange={(event) => {
                  setTeacherEmail(event.target.value);
                }}
                className="validate"
              />
              <label htmlFor="teacherEmail">Email</label>
              <span className="helper-text">
                {createTeacherError ? (
                  <h6 className="center-align red-text">
                    {createTeacherError}
                  </h6>
                ) : (
                  "( eg- example@gmial.com )"
                )}
              </span>
              <h6 className="center-align green-text">{createTeacherResult}</h6>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn-flat red-text"
          >
            Close
          </a>
          <a
            href="#!"
            onClick={() => {
              setCreateTeacherError("");
              if (!teacherEmail) {
                setCreateTeacherError("Please enter the new teacher email");
              } else {
                const addAdminRole = firebase
                  .functions()
                  .httpsCallable("addTeacherRole");

                addAdminRole({ email: teacherEmail }).then((result) => {
                  if (result.data.errorInfo || result.data.error) {
                    err =
                      (result.data.errorInfo !== undefined &&
                        result.data.errorInfo.message) ||
                      result.data.error;
                    setCreateTeacherError(err);
                  }
                  setTeacherEmail("");
                  setCreateTeacherResult(result.data.message);
                  console.log(result);
                });
              }
            }}
            className=" waves-effect waves-green btn-flat green-text"
          >
            Add
          </a>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Header);
