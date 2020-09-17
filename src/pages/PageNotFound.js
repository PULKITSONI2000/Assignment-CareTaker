import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div>
      <h1 className="valign-center centre">
        Go back home<Link to={"/"}>Home</Link>
      </h1>
    </div>
  );
};

export default PageNotFound;
