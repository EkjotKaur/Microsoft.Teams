import React, { useEffect, useState } from "react";
import "./ChatBar.css";
import VideoCameraImg from "../../../assets/images/Chat/video-camera.png";
import { useHistory } from "react-router-dom";

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
          {props.team && props.team.name}
          {props.name && props.name}
        </div>
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
