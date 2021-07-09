import React, { useEffect, useState } from "react";
import "./ChatBar.css";
import VideoCameraImg from "../../../assets/images/Chat/video-camera.png";
import { useHistory } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

// import

const ChatBar = (props) => {
  const [user, setUser] = useState();
  const history = useHistory();

  useEffect(() => {
    if (props.conversation) {
      const friendId = props.conversation.members.find(
        (m) => m._id !== props.currentUser._id
      );
      console.log(friendId);
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
            window.innerHeight > 685 &&
            props.team.name.substring(0, Math.min(35, props.team.name.length))}
          {props.team &&
            window.innerHeight > 445 &&
            window.innerHeight <= 685 &&
            props.team.name.substring(0, Math.min(20, props.team.name.length))}
          {props.team &&
            window.innerHeight <= 445 &&
            props.team.name.substring(0, Math.min(10, props.team.name.length))}
          {props.team &&
            window.innerHeight > 685 &&
            props.team.name.length > 35 &&
            "..."}
          {props.team &&
            window.innerHeight > 445 &&
            window.innerHeight <= 685 &&
            props.team.name.length > 20 &&
            "..."}
          {props.team &&
            window.innerHeight <= 445 &&
            props.team.name.length > 10 &&
            "..."}
          {props.name && props.name}
        </div>
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
              <div className="teamCode">Team Code: {props.team.code}</div>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
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
    </div>
  );
};

export default ChatBar;
