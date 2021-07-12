import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { UserContext } from "../../App";
import ChatBar from "../General/ChatBar/ChatBar";
import "./NewChat.css";
import SendImg from "../../assets/images/TextBox/send.png";
import * as chatApi from "../../api/chatting";
import { ToastContainer, toast } from "react-toastify";

// import

const NewChat = (props) => {
  const { state, disptch } = useContext(UserContext);
  const { userId, userName } = useParams();
  const [newMessage, setMessage] = useState();
  const history = useHistory();

  // When a message (first) is created, it creates a new conversation
  const onSubmitHandler = async (e) => {
    if (!newMessage) {
      return;
    }

    let createConversationData;
    try {
      createConversationData = await chatApi.newConversation({
        senderId: state._id,
        recieverId: userId,
      });
    } catch (err) {
      console.log(err);
      toast(
        `${
          err.response && err.response.data
            ? err.response.data.message
            : "Something went wrong."
        }`
      );
    }

    if (createConversationData.data.status == "false") {
      return;
    }
    const message = {
      senderId: state._id,
      text: newMessage,
      conversationId: createConversationData.data.data._id,
    };

    chatApi
      .newMessage(message)
      .then((result) => {
        console.log(result);
        history.push("/chat");
        // if (result.data.room == teamId)
      })
      .catch((err) => {
        console.log(err);
        toast(
          `${
            err.response && err.response.data
              ? err.response.data.message
              : "Something went wrong."
          }`
        );
      });
  };

  return (
    <div className="NewChat">
      <ToastContainer />
      <ChatBar name={userName} currentUser={state} video={false} />
      <div className="newChat">
        <div className="chatBoxTop"></div>
        <div className="chatBoxBottom">
          <textarea
            className="chatMessageInput"
            placeholder="Type a new message"
            onChange={(e) => setMessage(e.target.value)}
            value={newMessage}
          />
        </div>
        <div className="messageSendBtn">
          <div onClick={() => onSubmitHandler()} className="submitButton">
            <img src={SendImg} alt="Send" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
