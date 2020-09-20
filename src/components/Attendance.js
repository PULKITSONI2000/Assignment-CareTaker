import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/Context";

import { nanoid } from "nanoid";

import firebase from "firebase/app";
import "firebase/firestore";
import { toast } from "react-toastify";
import AttendenceRecord from "./AttendenceRecord";

const Attendance = ({ classInfo }) => {
  const { state } = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const [attendenceInfo, setAttendenceInfo] = useState({});

  useEffect(() => {
    if (classInfo.attendances) {
      var unsubscribe = firebase
        .firestore()
        .collection("attendence")
        .doc(
          classInfo.attendances[classInfo.attendances.length - 1].attendanceId
        )
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
      if (classInfo.attendances) {
        unsubscribe();
      }
    };
    // eslint-disable-next-line
  }, []);

  const isPresent = () => {
    var present = false;
    attendenceInfo.presentStudents &&
      attendenceInfo.presentStudents.forEach((presents) => {
        presents.studentId === state.user.uid && (present = true);
      });
    return present;
  };

  const markPresent = () => {
    var db = firebase.firestore();
    var sfDocRef = db
      .collection("attendence")
      .doc(
        classInfo.attendances[classInfo.attendances.length - 1].attendanceId
      );

    return db
      .runTransaction(function (transaction) {
        return transaction.get(sfDocRef).then(function (sfDoc) {
          if (!sfDoc.exists) {
            // eslint-disable-next-line
            throw "Document does not exist!";
          }

          transaction.update(sfDocRef, {
            presentStudents: firebase.firestore.FieldValue.arrayUnion({
              studentId: state.user.uid,
              studentName: state.user.displayName,
              studentPhotoUrl: state.user.photoURL,
            }),
          });
          transaction.update(sfDocRef, {
            absentStudents: firebase.firestore.FieldValue.arrayRemove({
              studentId: state.user.uid,
              studentName: state.user.displayName,
              studentPhotoUrl: state.user.photoURL,
            }),
          });
        });
      })
      .then(function () {
        toast.success("Marked Present");
      })
      .catch(function (error) {
        console.log("Transaction failed: ", error);
        toast.error("Please Try again");
      });
  };

  const endAttendence = () => {
    var db = firebase.firestore();
    var batch = db.batch();

    batch.update(
      db
        .collection("attendence")
        .doc(
          classInfo.attendances[classInfo.attendances.length - 1].attendanceId
        ),
      {
        endDate: firebase.firestore.FieldValue.serverTimestamp(),
      }
    );

    var date = new Date();
    const endDate = `${date.getDate() <= 9 ? 0 : ""}${date.getDate()} / ${
      date.getMonth() <= 9 && 0
    }${date.getMonth()} / ${date.getFullYear()}  ||  ${
      date.getHours() <= 9 ? 0 : ""
    }${date.getHours()} : ${
      date.getMinutes() <= 9 ? 0 : ""
    }${date.getMinutes()}`;

    if (classInfo.attendances) {
      classInfo.attendances[classInfo.attendances.length - 1].endDate = endDate;
    }

    batch.update(
      db
        .collection("user")
        .doc(classInfo.teacherId)
        .collection("classes")
        .doc(classInfo.code),
      {
        attendances: classInfo.attendances,
      }
    );

    batch
      .commit()
      .then(() => {
        setSuccess("Successfully Ended Taking Attendence");
        toast.success("Successfully Ended Taking Attendence");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  const stateAttendence = () => {
    const code = nanoid(14);

    var db = firebase.firestore();
    var batch = db.batch();

    batch.set(db.collection("attendence").doc(code), {
      startDate: firebase.firestore.FieldValue.serverTimestamp(),
      endDate: false,
      classCode: classInfo.code,
      teacherId: state.user.uid,
      attendanceId: code,
      presentStudents: [],
      absentStudents: classInfo.students,
    });

    var date = new Date();
    const startDate = `${date.getDate() <= 9 ? 0 : ""}${date.getDate()} / ${
      date.getMonth() <= 9 && 0
    }${date.getMonth()} / ${date.getFullYear()}  ||  ${
      date.getHours() <= 9 ? 0 : ""
    }${date.getHours()} : ${
      date.getMinutes() <= 9 ? 0 : ""
    }${date.getMinutes()}`;

    batch.update(
      db
        .collection("user")
        .doc(classInfo.teacherId)
        .collection("classes")
        .doc(classInfo.code),
      {
        attendances: firebase.firestore.FieldValue.arrayUnion({
          attendanceId: code,
          startDate: startDate,
          endDate: false,
        }),
      }
    );
    batch
      .commit()
      .then(() => {
        setSuccess("Successfully Start Taking Attendence");
        toast.success("Successfully Start Taking Attendence");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err);
      });
  };

  return (
    <div>
      <h5 className="center-align green-text">{success}</h5>

      {/* TODO: Remove */}
      {/* {console.log(classInfo)} */}
      {/* {console.log(isPresent())} */}

      {state.teacher ? (
        !classInfo.attendances ? (
          <div className="center-align">
            {/* /// Teacher Section */}
            <button
              className="waves-effect waves-light btn-large mt-20"
              onClick={stateAttendence}
            >
              Start Taking Take Attendance
            </button>
            <div className="center-align mt-50">
              {classInfo.attendances && classInfo.attendances.length > 0 && (
                <AttendenceRecord
                  classInfo={classInfo}
                  attendenceInfo={attendenceInfo}
                />
              )}
            </div>
          </div>
        ) : classInfo.attendances[classInfo.attendances.length - 1].endDate ? (
          <div className="center-align">
            {/* /// Teacher Section */}
            <button
              className="waves-effect waves-light btn-large mt-20"
              onClick={stateAttendence}
            >
              Start Taking Attendance
            </button>
            <div className="center-align mt-50">
              {classInfo.attendances && classInfo.attendances.length > 0 && (
                <AttendenceRecord
                  classInfo={classInfo}
                  attendenceInfo={attendenceInfo}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="center-align">
            {/* /// Teacher Section */}
            <button
              className="waves-effect waves-light btn-large red  mt-20"
              onClick={endAttendence}
            >
              End Taking Attendance
            </button>
            <div className="center-align mt-50">
              {classInfo.attendances && classInfo.attendances.length > 0 && (
                <AttendenceRecord
                  classInfo={classInfo}
                  attendenceInfo={attendenceInfo}
                />
              )}
            </div>
          </div>
        )
      ) : isPresent() ? (
        <h5 className="center-align green-text mt-20">You are Present</h5>
      ) : classInfo.attendances ? (
        classInfo.attendances[classInfo.attendances.length - 1].endDate ? (
          <h5 className="center-align orange-text mt-20">
            No Attendance is taken rignt now
          </h5>
        ) : (
          <div className="center-align">
            <button
              className="waves-effect waves-light btn-large mt-20"
              onClick={markPresent}
            >
              Mark Present
            </button>
          </div>
        )
      ) : (
        <h5 className="center-align orange-text mt-20">
          No Attendance is taken rignt now
        </h5>
      )}
      {/* {console.log("attendenceInfo", attendenceInfo)} */}
    </div>
  );
};

export default Attendance;
