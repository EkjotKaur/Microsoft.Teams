import React from "react";
import "./Loading.css";
import LoadingIcon from "../../../assets/images/Loading/teamsIcon.png";

// import

const Loading = (props) => {
  return (
    <div className="Loading">
      <img src={LoadingIcon} alt="teams" />
    </div>
  );
};

export default Loading;
