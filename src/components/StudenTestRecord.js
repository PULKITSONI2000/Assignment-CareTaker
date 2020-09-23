import React, { useContext, useEffect, useState } from "react";
import M from "materialize-css/dist/js/materialize.min.js";

import firebase from "firebase/app";
import "firebase/firestore";

import { HiOutlineClipboard, HiOutlineClipboardCheck } from "react-icons/hi";
import { UserContext } from "../context/Context";
import { toast } from "react-toastify";
import ShowTest from "./ShowTest";
import SubmitTest from "./SubmitTest";

const StudenTestRecord = ({ classInfo }) => {
  const [tests, setTests] = useState([]);
  const [testId, setTestId] = useState("");
  const [testInfo, setTestInfo] = useState({});
  const [SubmittedAnswarInfo, setSubmittedAnswarInfo] = useState({});
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);

  const { state } = useContext(UserContext);

  useEffect(() => {
    var elems = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elems, {});

    var elemsTebs = document.querySelectorAll(".tabs");
    M.Tabs.init(elemsTebs, {});

    var arr = classInfo.tests;
    var revArr = [];
    arr.forEach((element, index) => {
      revArr.push(arr[arr.length - 1 - index]);
    });
    setTests(revArr);

    return () => {
      setTestId("");
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (testId) {
      var unsubscribe = firebase
        .firestore()
        .collection("tests")
        .doc(testId)
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
      if (testId) {
        unsubscribe();
      }
    };
    // eslint-disable-next-line
  }, [testId]);

  useEffect(() => {
    testInfo.presentStudents &&
      testInfo.presentStudents.forEach((presents) => {
        if (presents.studentId === state.user.uid) {
          setIsTestSubmitted(true);
          if (presents.marks) {
            firebase
              .firestore()
              .collection("submittedTest")
              .doc(presents.submittionId)
              .get()
              .then((result) => {
                setSubmittedAnswarInfo(result.data());
              })
              .catch((err) => {
                console.log(err);
                toast.error("Failed to load");
              });
          }
        }
      });
    return () => {};
    // eslint-disable-next-line
  }, [testInfo.presentStudents]);

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

    if (start < now) {
      return true;
    }
    return false;
  };

  return (
    <div>
      <div className="container">
        <h4 className="center-align primary">Tests</h4>
        <div className="scroll">
          <ul className="collapsible">
            {tests.map((test, index) => (
              <li key={index}>
                <div
                  className="collapsible-header center-align valign-wrapper"
                  onClick={() => {
                    setTestId(test.testId);
                  }}
                >
                  {isTestEnded(test.endDate) ? (
                    <HiOutlineClipboardCheck size="40" color="green" />
                  ) : (
                    <HiOutlineClipboard size="40" color="orange" />
                  )}

                  <h5 className="ml-10 primary my-0">{test.testName}</h5>
                </div>
                <div className="collapsible-body">
                  <div className="center-align">
                    <table className="striped">
                      <tbody>
                        <tr>
                          <td className="bold">Start Time</td>
                          <td>{test.startDate.slice(0, 24)}</td>
                        </tr>

                        <tr>
                          <td className="bold">End Time</td>
                          <td>{test.endDate.slice(0, 24)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {testInfo &&
                    (isTestSubmitted ? (
                      <div>
                        <h5 className="center-align green-text mt-20">
                          You Sumitted the test
                        </h5>
                        {SubmittedAnswarInfo && (
                          <div>
                            <h5 className="secondary">
                              Grade : {SubmittedAnswarInfo.marks}
                            </h5>
                            <div className="container">
                              {SubmittedAnswarInfo.remark && (
                                <div>
                                  <div className="divider"></div>
                                  <h5 className="left-align primary">
                                    Remarks :
                                  </h5>
                                  <ul className="collection">
                                    {SubmittedAnswarInfo.remark.map(
                                      (feedback, index) => (
                                        <li
                                          key={index}
                                          className="collection-item left-align"
                                        >
                                          <div>
                                            {feedback.feedback}
                                            <span className="secondary-content grey-text">
                                              ~{feedback.teacher}
                                            </span>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <ShowTest testInfo={testInfo} />
                      </div>
                    ) : classInfo.tests ? (
                      isTestEnded(test.endDate) ? (
                        // TODO:
                        <div>
                          <h5 className="center-align orange-text mt-20">
                            You missed the test
                          </h5>
                          <ShowTest testInfo={testInfo} />
                        </div>
                      ) : isTestStarted(test.startDate) ? (
                        <div className="center-align">
                          {/* <SubmitTest testInfo={testInfo} /> */}
                          <ShowTest testInfo={testInfo} />
                          <SubmitTest testInfo={testInfo} />
                        </div>
                      ) : (
                        <h5 className="center-align orange-text mt-20">
                          Test Starting at <br />
                          <span className="secondary">
                            {test.startDate.slice(0, 24)}
                          </span>
                        </h5>
                      )
                    ) : (
                      <h5 className="center-align orange-text mt-20">
                        No test is taken rignt now
                      </h5>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudenTestRecord;
