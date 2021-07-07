import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import "./Conversations.css";
// import

const Conversation = (props) => {
  const [user, setUser] = useState();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const friendId = props.conversation.members.find(
      (m) => m._id !== state._id
    );
    console.log(friendId);
    setUser(friendId);
  }, []);

  console.log(props.conversation.members);
  console.log(props.currentUser._id);

  return (
    <div className="conversation">
      <span className="conversationImg">{user && user.name.match(/\b(\w)/g).join("")}</span>
      <span className="conversationName">{user && user.name}</span>
    </div>
  );
};

export default Conversation;
