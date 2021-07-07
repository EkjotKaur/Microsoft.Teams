import React from "react";

import "./HeadBar.css";

const HeadBar = (props) => {
  return (
    <div className="headBar">
      <div className="headBarBox">
        <div className="dots">. . .</div>
        <div className="dots">. . .</div>
        <div className="dots">. . .</div>
      </div>
      <div className="headSubBarBox">
        <div className="headBarTeamsHeading">
          <div className="headBarMSTeams">Microsoft Teams</div>
        </div>
        <div className="headBarSearch">
          <input type="text" className="headerBarSearchInput" placeholder="Search" />
        </div>
      </div>
    </div>
  );
};

export default HeadBar;

// #7F81E1
