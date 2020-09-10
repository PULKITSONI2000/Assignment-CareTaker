import React, { useContext } from "react";
import { withRouter, Link } from "react-router-dom";
import { BiBookAdd, BiMenu, BiLogIn } from "react-icons/bi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import M from "materialize-css/dist/js/materialize.min.js";
import firebase from "firebase/app";
import { UserContext } from "../context/Context";

const currentTab = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#222222" };
  } else {
    return { color: "#888888" };
  }
};

const Header = ({ history }) => {
  const { state } = useContext(UserContext);

  return (
    <div>
      <nav>
        {document.addEventListener("DOMContentLoaded", function () {
          var elems = document.querySelectorAll(".sidenav");
          M.Sidenav.init(elems, { preventScrolling: false });
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
                    }}
                  >
                    Log Out
                  </span>
                  <BiLogIn color="red" size={30} />
                </Link>
              </li>
            )}
            {state.user && (
              <li className="right">
                <Link
                  className="valign-wrapper"
                  style={currentTab(history, "/join")}
                  to="/join"
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
                to="/login"
                className="waves-effect right"
                onClick={() => {
                  firebase.auth().signOut();
                }}
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
        <li>
          <Link to={"/classes"}>Classes</Link>
        </li>
        <li>
          <Link to={"/"}>Second Link</Link>
        </li>
        <li>
          <div className="divider"></div>
        </li>

        <li>
          <Link to={"/"} className="subheader">
            Subheader
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default withRouter(Header);
