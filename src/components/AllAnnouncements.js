import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

import M from "materialize-css/dist/js/materialize.min.js";
import { toast } from "react-toastify";

const AllAnnouncements = ({ userId, isTeacher, classCode }) => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    var unsubscribe = firebase
      .firestore()
      .collectionGroup("announcement")
      .where("classCode", "==", classCode)
      .onSnapshot(
        (querySnapshot) => {
          var assigns = [];
          querySnapshot.forEach((doc) => {
            assigns.push(doc.data());
          });
          setAnnouncements(assigns);
        },
        (err) => {
          console.log(err);
        }
      );

    var elemsforCollapsible = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elemsforCollapsible, {});

    return () => {
      unsubscribe();
      setAnnouncements({});
    };
    // eslint-disable-next-line
  }, []);

  const deleteAnnouncement = (announcementId) => {
    firebase
      .firestore()
      .collection("user")
      .doc(userId)
      .collection("classes")
      .doc(classCode)
      .collection("announcement")
      .doc(announcementId)
      .delete()
      .then(function () {
        console.log("Document successfully deleted!");
        toast.success("Successfully deleted!");
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
        toast.success("Error removing document");
      });
  };
  return (
    <div>
      <ul className="collapsible">
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <li key={index}>
              <h5 className="collapsible-header primary">
                {/* <i className="material-icons">filter_drama</i> */}
                {announcement.announcementTitle}
                <span className="right-align grey-text ml-10">
                  ~{announcement.teacher}
                </span>
              </h5>
              <h6 className="collapsible-body primary">
                <span>{announcement.announcementDetails}</span>
                {isTeacher && (
                  <span
                    className="waves-effect waves-teal btn-flat right red-text"
                    onClick={() => {
                      deleteAnnouncement(announcement.announcementId);
                    }}
                  >
                    Delete
                  </span>
                )}
              </h6>
            </li>
          ))
        ) : (
          <div>
            <h4 className="center-align grey-text">No Announcements</h4>
          </div>
        )}
      </ul>
    </div>
  );
};

export default AllAnnouncements;
