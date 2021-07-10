import React, { useEffect, useState } from "react";

import "./SideNavbar.css";
import ChatImg from "../../../assets/images/Navbar/chat.png";
import ChatHoverImg from "../../../assets/images/Navbar/chat-hover.png";
import TeamsImg from "../../../assets/images/Navbar/teams.png";
import TeamsHoverImg from "../../../assets/images/Navbar/teams-hover.png";
import FilesImg from "../../../assets/images/Navbar/files.png";
import FilesHoverImg from "../../../assets/images/Navbar/files-hover.png";
import { useHistory, useLocation } from "react-router-dom";

const SideNavbar = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [active, setActive] = useState();

  useEffect(() => {
    console.log(location.pathname);
    if (location.pathname.includes("/chat")) setActive("Chat");
    if (location.pathname.includes("/contacts")) setActive("Contacts");
    if (
      location.pathname.includes("/teams") ||
      location.pathname.includes("/createTeams")
    )
      setActive("Teams");
  }, [location.pathname]);

  return (
    <div
      className={
        window.innerHeight < window.innerWidth ? "sideNavbar" : "bottomNavbar"
      }
    >
      <div className="sideNavItems">
        <div
          className={"sideNavlink"}
          onClick={(e) => {
            history.push("/chat");
            setActive("Chat");
          }}
        >
          <div className={active === "Chat" && "activeLink"}>
            <img src={active === "Chat" ? ChatHoverImg : ChatImg} alt="chat" />
          </div>
          <div className={active === "Chat" && "activeSideNavLink"}>Chat</div>
        </div>
        <div
          className="sideNavlink"
          onClick={(e) => {
            history.push("/teams");
            setActive("Teams");
          }}
        >
          <div className={active === "Teams" && "activeLink"}>
            <img
              className="currentSideBarIcon"
              src={active === "Teams" ? TeamsHoverImg : TeamsImg}
              alt="teams"
            />
            {/* <img src={TeamsHoverImg} alt="teams" className="hoverSideBarIcon" /> */}
          </div>
          <div className={active === "Teams" && "activeSideNavLink"}>Teams</div>
        </div>
        <div
          className="sideNavlink"
          onClick={(e) => {
            history.push("/contacts");
            setActive("Contacts");
          }}
        >
          <div className={active === "Contacts" && "activeLink"}>
            <img
              alt="contacts"
              className="currentSideBarIcon"
              src={active === "Contacts" ? FilesHoverImg : FilesImg}
            />
          </div>
          <div className={active === "Contacts" && "activeSideNavLink"}>
            Contacts
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default SideNavbar;

// #7F81E1
