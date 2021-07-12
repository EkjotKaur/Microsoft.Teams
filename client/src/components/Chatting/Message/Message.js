import React from "react";
import "./Message.css";
import { format } from "timeago.js";

// returns a single message of the chat
const Message = (props) => {
  return (
    <div className={props.own ? "message own" : "message"}>
      {!props.own && window.innerWidth > 900 && (
        <div className="messagePic">
          {props.message.sender.name.match(/\b(\w)/g).join("")}
        </div>
      )}
      <div className="messageBox">
        <div>
          {!props.own && (
            <span className="otherNameMessage">
              {props.message.sender.name}
            </span>
          )}
          {"  "}
          <span className="messageTime">{format(props.message.createdAt)}</span>
        </div>

        <div>{props.message.text}</div>
      </div>
    </div>
  );
};

export default Message;
