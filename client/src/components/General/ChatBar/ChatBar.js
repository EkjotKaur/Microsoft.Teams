import React, { useEffect, useState } from "react";
import "./ChatBar.css";
import VideoCameraImg from "../../../assets/images/Chat/video-camera.png";
import { useHistory } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Common bar used in all the chat and notes pages
const ChatBar = (props) => {
  const [user, setUser] = useState();
  const [copied, setCopied] = useState(false);
  const history = useHistory();

  useEffect(() => {
    // To get the other user from personal chat
    if (props.conversation) {
      const friendId = props.conversation.members.find(
        (m) => m._id !== props.currentUser._id
      );
      setUser(friendId);
    }
  }, [props.conversation, props.currentUser._id]);

  return (
    <div className="ChatBar">
      <div className="ChatBarName">
        {window.innerWidth <= 900 && user && (
          <div className="leftArrow" onClick={() => props.onGoBack()}>
            {" "}
            ‹{" "}
          </div>
        )}

        {(user || props.name) && (
          <div className="ChatBarNameImg">
            {user && user.name.match(/\b(\w)/g).join("")}
            {props.name && props.name.match(/\b(\w)/g).join("")}
          </div>
        )}
        {props.team && (
          <div className="ChatBarNameImgTeams">
            {" "}
            {props.team.name.match(/\b(\w)/g).join("")}
          </div>
        )}

        <div>
          {" "}
          {user && user.name}
          {/* {props.team && props.team.name} */}
          {props.team &&
            window.innerWidth > 685 &&
            props.team.name.substring(0, Math.min(30, props.team.name.length))}
          {props.team &&
            window.innerWidth > 445 &&
            window.innerWidth <= 685 &&
            props.team.name.substring(0, Math.min(15, props.team.name.length))}
          {props.team &&
            window.innerWidth <= 445 &&
            props.team.name.substring(0, Math.min(5, props.team.name.length))}
          {props.team &&
            window.innerWidth > 685 &&
            props.team.name.length > 30 &&
            "..."}
          {props.team &&
            window.innerWidth > 445 &&
            window.innerWidth <= 685 &&
            props.team.name.length > 15 &&
            "..."}
          {props.team &&
            window.innerWidth <= 445 &&
            props.team.name.length > 5 &&
            "..."}
          {props.name && props.name}
        </div>
        {props.tabs && (
          <div className="tabs">
            <div
              className={props.active === "Chat" && "active"}
              onClick={() => props.onChangeTab("Chat")}
            >
              Chat
            </div>
            <div
              className={props.active === "Notes" && "active"}
              onClick={() => props.onChangeTab("Notes")}
            >
              Notes
            </div>
          </div>
        )}
        {props.team && (
          <Dropdown>
            <Dropdown.Toggle
              className="codeBtn"
              variant="success"
              id="dropdown-basic"
            >
              ⋮
            </Dropdown.Toggle>

            <Dropdown.Menu className="dropdownBody codeBody">
              <div className="teamCode">
                <div>Team Code:</div>
                <div>{props.team.code}</div>
                <CopyToClipboard
                  text={props.team.code}
                  onCopy={() => setCopied(true)}
                >
                  <div className="copy">Copy</div>
                </CopyToClipboard>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      <div className="ChatBarRightRow">
        {props.video && (
          <div className="CharBarRight">
            <div
              className="CharBarVideoCalling"
              onClick={() => {
                if (props.conversation)
                  history.push(`/room/${props.conversation._id}`);
                else history.push(`/room/${props.team._id}`);
              }}
            >
              <img
                src={VideoCameraImg}
                alt="video"
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        )}
        {props.leave && (
          <div className="leaveTeam" onClick={() => props.onLeave()}>
            Leave
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBar;
