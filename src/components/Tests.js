import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/Context";

import firebase from "firebase/app";
import "firebase/firestore";
import StartTest from "./StartTest";
import TestRecord from "./TestRecord";
import SubmitTest from "./SubmitTest";

const Tests = ({ classInfo }) => {
  const { state } = useContext(UserContext);

  const [testInfo, setTestInfo] = useState({});

  useEffect(() => {
    if (classInfo.tests) {
      var unsubscribe = firebase
        .firestore()
        .collection("tests")
        .doc(classInfo.tests[classInfo.tests.length - 1].testId)
        .onSnapshot(
          (querySnapshot) => {
            setTestInfo(querySnapshot.data());
          },
          (err) => {
            console.log(err);
          }
        );
    }

    return () => {
      if (classInfo.tests) {
        unsubscribe();
      }
    };
    // eslint-disable-next-line
  }, []);

  /// functions

  const endTest = () => {};

  const isTestSubmitted = () => {
    var present = false;
    testInfo.presentStudents &&
      testInfo.presentStudents.forEach((presents) => {
        presents.studentId === state.user.uid && (present = true);
      });
    return present;
  };

  const isTestEnded = (endDate) => {
    var end = new Date(endDate);
    var now = new Date();

    if (end > now) {
      return false;
    }
    return true;
  };

  return (
    <div className="mt-50">
      {state.teacher ? (
        !classInfo.tests ? (
          <div className="center-align">
            <div className="center-align mt-50">
              {classInfo.tests && classInfo.tests.length > 0 && (
                <TestRecord classInfo={classInfo} />
              )}
            </div>

            <StartTest classInfo={classInfo} />
          </div>
        ) : isTestEnded(classInfo.tests[classInfo.tests.length - 1].endDate) ? (
          // TODO:
          <div className="center-align">
            <div className="center-align mt-50">
              {classInfo.tests && classInfo.tests.length > 0 && (
                <TestRecord classInfo={classInfo} />
              )}
            </div>

            <StartTest classInfo={classInfo} />
          </div>
        ) : (
          <div className="center-align">
            {/* /// Teacher Section */}
            <button
              className="waves-effect waves-light btn-large red  mt-20"
              onClick={endTest}
            >
              End Test
            </button>
            <div className="center-align mt-50">
              {classInfo.tests && classInfo.tests.length > 0 && (
                <TestRecord classInfo={classInfo} />
              )}
            </div>
          </div>
        )
      ) : isTestSubmitted() ? (
        <h5 className="center-align green-text mt-20">You Sumitted the test</h5>
      ) : classInfo.tests ? (
        isTestEnded(classInfo.tests[classInfo.tests.length - 1].endDate) ? (
          // TODO:

          <h5 className="center-align orange-text mt-20">
            You missed the test
          </h5>
        ) : (
          <div className="center-align">
            <SubmitTest testInfo={testInfo} />
          </div>
        )
      ) : (
        <h5 className="center-align orange-text mt-20">
          No test is taken rignt now
        </h5>
      )}
    </div>
  );
};

export default Tests;
