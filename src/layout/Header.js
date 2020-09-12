import React, { useContext, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { BiBookAdd, BiMenu, BiLogIn } from "react-icons/bi";
import { RiLogoutBoxRLine } from "react-icons/ri";

import M from "materialize-css/dist/js/materialize.min.js";

import firebase from "firebase/app";
import { UserContext } from "../context/Context";
import { SET_USER } from "../context/action.types";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#222222" };
  } else {
    return { color: "#888888" };
  }
};

const Header = ({ history }) => {
  const { state, dispatch } = useContext(UserContext);
  const [teacherEmail, setTeacherEmail] = useState("");

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
            Logo
          </Link>

          <span data-target="slide-out" className="sidenav-trigger">
            <BiMenu size={30} className="mt-10 pointer" />
          </span>

          <ul id="nav-mobile" className="">
            {!state.user ? (
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
              <li className="right">
                <Link to="/login" className="valign-wrapper">
                  <span
                    className="waves-effect  red-text"
                    onClick={() => {
                      firebase.auth().signOut();
                      dispatch({
                        type: SET_USER,
                        payload: false,
                      });
                    }}
                  >
                    Log Out
                  </span>
                  <BiLogIn color="red" size={30} />
                </Link>
              </li>
            )}
            {state.teacher ? (
              <li className="right">
                <Link
                  className="valign-wrapper"
                  style={currentTab(history, "/class/create")}
                  to="/class/create"
                >
                  <span className="hide-on-small-only">Create Class</span>{" "}
                  <BiBookAdd size={30} />
                </Link>
              </li>
            ) : (
              <li className="right">
                <Link
                  className="valign-wrapper"
                  style={currentTab(history, "/class/join")}
                  to="/class/join"
                >
                  <span className="hide-on-small-only">Join Class</span>{" "}
                  <BiBookAdd size={30} />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>
      <ul id="slide-out" className="sidenav">
        <li>
          <div className="user-view">
            <div className="background cyan">
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
              {state.user && state.user.photoURL && (
                <img className="circle" alt="" src={state.user.photoURL} />
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
            <Link to={"/classes"}>Classes</Link>
          </li>
        )}
        {state.user && state.teacher && (
          <li>
            <Link to={"/class/create"}>Create Class</Link>
          </li>
        )}
        {!state.user && (
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
        )}
        <li>
          <div className="divider"></div>
        </li>

        <li>
          {/* TODO: only for admin */}
          {state.teacher && (
            <Link to={"/"} data-target="addTeacher" className=" modal-trigger">
              Add Teacher
            </Link>
          )}
        </li>
      </ul>

      {/* Modal */}
      <div id="addTeacher" className="modal">
        <div className="modal-content">
          <h4>Add Teacher</h4>

          <div className="row">
            <h5>Add Teacher Email Id</h5>
            <div className="input-field col s12">
              <input
                id="teacherEmail"
                type="email"
                value={teacherEmail}
                onChange={(event) => {
                  setTeacherEmail(event.target.value);
                }}
                className="validate"
              />
              <label htmlFor="teacherEmail">Email</label>
              <span
                className="helper-text"
                data-error="Please check the mail "
                data-success="right"
              >
                ( eg- example@gmial.com )
              </span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn-flat"
          >
            Close
          </a>
          <a
            href="#!"
            onClick={() => {
              const addAdminRole = firebase
                .functions()
                .httpsCallable("addTeacherRole");
              console.log("Email", teacherEmail);

              addAdminRole({ email: teacherEmail }).then((result) => {
                console.log(result);
              });
            }}
            className="modal-close waves-effect waves-green btn-flat"
          >
            Add
          </a>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Header);
