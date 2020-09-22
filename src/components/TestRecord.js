import React, { useEffect, useState } from "react";

import M from "materialize-css/dist/js/materialize.min.js";

import { HiOutlineClipboard, HiOutlineClipboardCheck } from "react-icons/hi";
import { BiLinkExternal } from "react-icons/bi";
import { Link } from "react-router-dom";

const TestRecord = ({ classInfo }) => {
  const [tests, setTests] = useState([]);

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

    return () => {};
    // eslint-disable-next-line
  }, []);

  const isTestEnded = (endDate) => {
    var end = new Date(endDate);
    var now = new Date();

    if (end > now) {
      return false;
    }
    return true;
  };

  return (
    <div className="container">
      <h4 className="center-align primary">Tests</h4>
      <div className="scroll">
        <ul className="collapsible">
          {tests.map((test, index) => (
            <li key={index}>
              <div className="collapsible-header center-align valign-wrapper">
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
                <Link to={`/test/report/${test.testId}`}>
                  <h5>
                    Open
                    <BiLinkExternal size={30} />
                  </h5>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestRecord;
