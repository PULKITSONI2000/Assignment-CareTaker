import React, { useContext, useEffect, useState } from "react";
import AddNotification from "../components/AddNotification";
import { UserContext } from "../context/Context";
import firebase from "firebase/app";
import "firebase/firestore";
import { FaFileImage, FaFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import { AiFillNotification } from "react-icons/ai";

import M from "materialize-css/dist/js/materialize.min.js";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    var unsubscribe = firebase
      .firestore()
      .collection("notification")
      .onSnapshot(
        (querySnapshot) => {
          var notifications = [];
          querySnapshot.forEach((doc) => {
            notifications.push(doc.data());
          });
          setNotifications(notifications);
        },
        (err) => {
          console.log(err);
          toast.error(err);
        }
      );
    var elemsforCollapsible = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elemsforCollapsible, {});

    return () => {
      unsubscribe();
      setNotifications([]);
    };
  }, []);

  const deleteAnnouncement = (notificationId) => {
    firebase
      .firestore()
      .collection("notification")
      .doc(notificationId)
      .delete()
      .then(function () {
        console.log("noitfication successfully Removes!");
        toast.success("Successfully Removed!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
        toast.success("Error removing document");
      });
  };

  return (
    <div className="container">
      <h2 className="primary bold underline">Notifications :-</h2>
      <ul className="collapsible">
        {notifications.length > 0 ? (
          notifications.map((notifications, index) => (
            <li key={index}>
              <h5 className="collapsible-header primary">
                {/* <i className="material-icons">filter_drama</i> */}
                <AiFillNotification size={30} className="left mr-15" />
                {notifications.notificationTitle}
              </h5>
              <div className="collapsible-body primary">
                <h6>{notifications.notificationDetails}</h6>

                {state.admin && (
                  <span
                    className="waves-effect waves-teal btn-flat right red-text"
                    onClick={() => {
                      deleteAnnouncement(notifications.notificationId);
                    }}
                  >
                    Delete
                  </span>
                )}
                {/* /// attachments */}
                <ul className="collection">
                  <div className="mt-30" style={{ marginTop: 30 }}>
                    {notifications.notificationFiles &&
                      notifications.notificationFiles.map((pdf, index) => (
                        <li key={index} className="collection-item">
                          <div>
                            <a
                              href={pdf.pdfFile}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {pdf.pdfName.slice(-3) === "pdf" ? (
                                <FaFilePdf
                                  size={30}
                                  className="left"
                                  color="red"
                                />
                              ) : (
                                <FaFileImage
                                  size={30}
                                  className="left"
                                  color="blue"
                                />
                              )}
                              <h5 className="valign-wrapper">
                                {pdf.pdfName.slice(0, -4)}
                              </h5>
                            </a>
                          </div>
                        </li>
                      ))}
                  </div>
                </ul>
              </div>
            </li>
          ))
        ) : (
          <div>
            <h4 className="center-align grey-text">No Announcements</h4>
          </div>
        )}
      </ul>

      {state.admin && <AddNotification />}
    </div>
  );
};

export default Notifications;
