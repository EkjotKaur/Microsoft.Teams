import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import "./Conversations.css";
// import

const Conversation = (props) => {
  const [user, setUser] = useState();
  const { state, dispatch } = useContext(UserContext);

  // To find the other member of the personal chat
  useEffect(() => {
    const friendId = props.conversation.members.find(
      (m) => m._id !== state._id
    );
    console.log(friendId);
    setUser(friendId);
  }, []);

  return (
    <div className="conversation">
      <span className="conversationImg">
        {user && user.name.match(/\b(\w)/g).join("")}
      </span>
      <span className="conversationName">{user && user.name}</span>
    </div>
  );
};

export default Conversation;
