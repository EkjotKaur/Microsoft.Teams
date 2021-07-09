import React, { useContext, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../App";

import "./HeadBar.css";
import SearchResults from "./SearchResults/SearchResult";

const HeadBar = (props) => {
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const history = useHistory();
  console.log(search);

  const clearResultHandler = () => setSearch()

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
          <input
            type="text"
            className="headerBarSearchInput"
            placeholder="Search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          {search && <SearchResults search={search} onClearHandler={clearResultHandler} />}
        </div>
        {state && (
          <div className="headerBarProfile">
            {/* <div className="headerBarProfileImg">
            {state.name.match(/\b(\w)/g).join("")}
          </div> */}
            <Dropdown>
              <Dropdown.Toggle
                className="headerBarProfileImg"
                variant="success"
                id="dropdown-basic"
              >
                {state.name.match(/\b(\w)/g).join("")}
              </Dropdown.Toggle>

              <Dropdown.Menu className="dropdownBody">
                <div className="profileOfUser">
                  <div className="profileOfUserImg">
                    {state.name.match(/\b(\w)/g).join("")}
                  </div>
                  <div className="profileOfUserImgDetails">
                    <div className="profileOfUserImgDetailsName">
                      {state.name}
                    </div>
                    <div className="profileOfUserImgDetailsEmail">
                      {state.email}
                    </div>
                  </div>
                </div>
                <div
                  className="signout"
                  onClick={() => {
                    localStorage.clear();
                    dispatch({ type: "CLEAR" });
                    history.push("/");
                  }}
                >
                  Sign Out
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadBar;

// #7F81E1
