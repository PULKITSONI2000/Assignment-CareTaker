import React from "react";
import { FaFileImage, FaFilePdf } from "react-icons/fa";

const ShowTest = ({ testInfo }) => {
  return (
    <div className="fg-box">
      <div className="container left-align p-box">
        <h4 className="underline primary bold capitalize center">
          {testInfo.testName}
        </h4>

        <blockquote className="flow-text mt-50 ">
          {testInfo.testDescription}
        </blockquote>

        {testInfo.startDate && (
          <h6 className="mt-50 orange-text ">
            Start Data :
            <span className="ml-10 teal-text">{`${
              (new Date(testInfo.startDate.toDate()).getHours() % 12 || "12") <
              10
                ? `0${
                    new Date(testInfo.startDate.toDate()).getHours() % 12 ||
                    "12"
                  }`
                : new Date(testInfo.startDate.toDate()).getHours() % 12 || "12"
            } : ${
              new Date(testInfo.startDate.toDate()).getMinutes() < 10
                ? `0${new Date(testInfo.startDate.toDate()).getMinutes()}`
                : new Date(testInfo.startDate.toDate()).getMinutes()
            } ${
              new Date(testInfo.startDate.toDate()).getHours() >= 12
                ? "PM"
                : "AM"
            }`}</span>
            <span className="ml-10 light-blue-text">{`${new Date(
              testInfo.startDate.toDate()
            ).getDate()} / ${new Date(
              testInfo.startDate.toDate()
            ).getMonth()} / ${new Date(
              testInfo.startDate.toDate()
            ).getFullYear()}`}</span>
          </h6>
        )}
        {testInfo.endDate && (
          <h6 className="mt-10 orange-text ">
            End Data :
            <span className="ml-10 teal-text">{`${
              (new Date(testInfo.endDate.toDate()).getHours() % 12 || "12") < 10
                ? `0${
                    new Date(testInfo.endDate.toDate()).getHours() % 12 || "12"
                  }`
                : new Date(testInfo.endDate.toDate()).getHours() % 12 || "12"
            } : ${
              new Date(testInfo.endDate.toDate()).getMinutes() < 10
                ? `0${new Date(testInfo.endDate.toDate()).getMinutes()}`
                : new Date(testInfo.endDate.toDate()).getMinutes()
            } ${
              new Date(testInfo.endDate.toDate()).getHours() >= 12 ? "PM" : "AM"
            }`}</span>
            <span className="ml-10 light-blue-text">{`${new Date(
              testInfo.endDate.toDate()
            ).getDate()} / ${new Date(
              testInfo.endDate.toDate()
            ).getMonth()} / ${new Date(
              testInfo.endDate.toDate()
            ).getFullYear()}`}</span>
          </h6>
        )}

        {/* /// attachments */}
        <div className="mt-50">
          {testInfo.testFiles && testInfo.testFiles.length > 0 && (
            <ul className="collection with-header">
              {testInfo.testFiles && testInfo.testFiles.length > 0 && (
                <li className="collection-header">
                  <h5 className="green-text">Attachments</h5>
                </li>
              )}
              {testInfo.testFiles &&
                testInfo.testFiles.map((pdf, index) => (
                  <li key={index} className="collection-item">
                    <div>
                      <a
                        href={pdf.pdfFile}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pdf.pdfName.slice(-3) === "pdf" ? (
                          <FaFilePdf size={30} className="left" color="red" />
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
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowTest;
