import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/Context";

import firebase from "firebase/app";
import "firebase/firestore";
import StartTest from "./StartTest";
import TestRecord from "./TestRecord";
import SubmitTest from "./SubmitTest";
import StudenTestRecord from "./StudenTestRecord";
import ShowTest from "./ShowTest";

const Tests = ({ classInfo }) => {
  const { state } = useContext(UserContext);

  const [testInfo, setTestInfo] = useState({});
  // TODO: Show test info in another component with timer
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

  // const endTest = () => {};

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

  const isTestStarted = (startDate) => {
    var start = new Date(startDate);
    var now = new Date();

    if (start <= now) {
      return true;
    }
    return false;
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
            <div className="center-align">
              <div className="center-align mt-50">
                {classInfo.tests && classInfo.tests.length > 0 && (
                  <TestRecord classInfo={classInfo} />
                )}
              </div>
              <h5 className="red-text">
                You already created an test You wanted to create another test on
                top that
              </h5>
              <StartTest classInfo={classInfo} />
            </div>
          </div>
        )
      ) : isTestSubmitted() ? (
        <div>
          <ShowTest testInfo={testInfo} />
          <h5 className="center-align green-text mt-20">
            You Sumitted the test
          </h5>
          <div className="center-align mt-50">
            {classInfo.tests && classInfo.tests.length > 0 && (
              <StudenTestRecord classInfo={classInfo} />
            )}
          </div>
        </div>
      ) : classInfo.tests ? (
        isTestEnded(classInfo.tests[classInfo.tests.length - 1].endDate) ? (
          // TODO:
          <div>
            <ShowTest testInfo={testInfo} />
            <h5 className="center-align orange-text mt-20">
              You missed the test
            </h5>
            <div className="center-align mt-50">
              {classInfo.tests && classInfo.tests.length > 0 && (
                <StudenTestRecord classInfo={classInfo} />
              )}
            </div>
          </div>
        ) : isTestStarted(
            classInfo.tests[classInfo.tests.length - 1].startDate
          ) ? (
          <div className="center-align">
            <ShowTest testInfo={testInfo} />
            <SubmitTest testInfo={testInfo} />
            <div className="center-align mt-50">
              {classInfo.tests && classInfo.tests.length > 0 && (
                <StudenTestRecord classInfo={classInfo} />
              )}
            </div>
          </div>
        ) : (
          <div>
            <h5 className="center-align orange-text mt-20">
              Test Starting at <br />
              <span className="secondary">
                {classInfo.tests[classInfo.tests.length - 1].startDate.slice(
                  0,
                  24
                )}
              </span>
            </h5>
            <div className="center-align mt-50">
              {classInfo.tests && classInfo.tests.length > 0 && (
                <StudenTestRecord classInfo={classInfo} />
              )}
            </div>
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
