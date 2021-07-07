import React from "react";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "./TeamBox.css";

const TeamsBox = ({ team }) => {
  const history = useHistory();
  return (
    <div
      className="teamBoxPic"
      onClick={() => history.push("/teams/" + team._id)}
    >
      <div className="teamsBoxPic">{team.name.match(/\b(\w)/g).join("")}</div>
      <div className="teamBoxName">{team.name}</div>
    </div>
  );
};

export default TeamsBox;
