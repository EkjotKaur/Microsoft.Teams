import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import "./TeamLeftSide.css";

// Left side of team
const TeamLeftSide = ({team}) => {
  const [user, setUser] = useState();
  const { state, dispatch } = useContext(UserContext);

  return (
    <div className="teamLeftSide">
      <span className="teamLeftSideImg">
        {team && team.name.match(/\b(\w)/g).join("")}
      </span>
      <span className="teamLeftSideName">{team && team.name}</span>
    </div>
  );
};

export default TeamLeftSide;
