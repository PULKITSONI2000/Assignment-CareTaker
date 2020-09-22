import React, { useEffect, useState } from "react";

import M from "materialize-css/dist/js/materialize.min.js";
import { Col, Row } from "react-materialize";
import AttendanceTabs from "./AttendanceTabs";
import { BiCalendar, BiCalendarCheck } from "react-icons/bi";

const AttendenceRecord = ({ classInfo, attendenceInfo }) => {
  const [attendances, setAttendances] = useState([]);
  const [currentAttendanceId, setCurrentAttendanceId] = useState();

  useEffect(() => {
    var elems = document.querySelectorAll(".collapsible");
    M.Collapsible.init(elems, {});

    var arr = classInfo.attendances;
    var revArr = [];
    arr.forEach((element, index) => {
      revArr.push(arr[arr.length - 1 - index]);
    });
    setAttendances(revArr);

    return () => {};
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Row>
        <Col push={"m4"} s={12} m={8}>
          <div className="show-on-medium-and-up">
            <div className="mt-50"></div>
          </div>
          {currentAttendanceId ? (
            <AttendanceTabs
              allStudent={classInfo.students}
              attendanceId={currentAttendanceId}
            />
          ) : (
            <h5 className="center-align orange-text">
              Please Select an Attendence Date
            </h5>
          )}
        </Col>
        <Col s={12} m={4} pull={"m8"}>
          <h4 className="center-align primary">Attandence Calender</h4>
          <div className="scroll">
            <ul className="collapsible">
              {attendances.map((attendence, index) => (
                <li
                  key={index}
                  onClick={() => {
                    // console.log(attendence.attendanceId);
                    setCurrentAttendanceId(attendence.attendanceId);
                  }}
                >
                  <div className="collapsible-header center-align">
                    {attendence.endDate ? (
                      <BiCalendarCheck size="35" color="green" />
                    ) : (
                      <BiCalendar size="35" color="orange" />
                    )}

                    <h6 className="ml-10">{attendence.startDate}</h6>
                  </div>
                  <div className="collapsible-body">
                    <div className="center-align">
                      <table className="striped">
                        <tbody>
                          <tr>
                            <td className="bold">Start Date</td>
                            <td>{attendence.startDate}</td>
                          </tr>
                          <tr>
                            <td className="bold">End Date</td>
                            <td>
                              {attendence.endDate || (
                                <span className="green-text">
                                  Attendence Is Corrently Active
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AttendenceRecord;
