import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div>
      <h2 className="valign-center ">
        <div className="center-align">
          <span>
            <h4>Click here to go back</h4>
            <Link to={"/"}>Go back home</Link>
          </span>
        </div>
      </h2>
    </div>
  );
};

export default PageNotFound;
