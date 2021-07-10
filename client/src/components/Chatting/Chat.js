import React, { useContext, useEffect, useRef, useState } from "react";
import "./Chat.css";
import Conversation from "./Conversations/Conversations";
import Message from "./Message/Message";
import * as chatApi from "../../api/chatting";
import { UserContext } from "../../App";
import io from "socket.io-client";
import { mainUrl } from "../../api/index";
import SidebarHeading from "../General/sidebarHeading";
import SendImg from "../../assets/images/TextBox/send.png";
import ChatBar from "../General/ChatBar/ChatBar";
import { ToastContainer, toast } from "react-toastify";

const Chat = () => {
  const { state, dispatch } = useContext(UserContext);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const socket = useRef(io(mainUrl));
  const scrollRef = useRef();

  useEffect(() => {
    socket.current.emit("addUserToChat", state._id);
  }, [state]);

  useEffect(() => {
    // console.log(state._id);
    chatApi
      .getConversation(state._id)
      .then((result) => {
        if (result.data.state == "false") console.log(result.data.message);
        else {
          setConversations(result.data.data);
        }
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
  }, []);

  useEffect(() => {
    if (currentChat) {
      chatApi
        .getMessage(currentChat._id)
        .then((result) => {
          // console.log(result.data);
          if (result.data.status == "false") console.log(result.data.message);
          else setMessages(result.data.data);
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
    }
  }, [currentChat]);

  const checkOwn = (id) => {
    return id === state._id;
  };

  const onSubmitHandler = (e) => {
    if (!newMessage) return;
    const message = {
      senderId: state._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiver = currentChat.members.find(
      (memeber) => memeber._id !== state._id
    );

    chatApi
      .newMessage(message)
      .then((result) => {
        setMessages([...messages, result.data.data]);
        setNewMessage("");
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

    socket.current.emit("sendMessage", {
      senderId: state._id,
      receiverId: receiver._id,
      text: newMessage,
    });
  };

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      console.log(data);
      const newdData = {
        sender: data.sender,
        text: data.text,
        createdAt: Date.now(),
      };
      setMessages((prev) => {
        console.log(prev, newdData);
        return [...prev, newdData];
      });
    });
  }, []);

  console.log(messages);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={
        window.innerHeight < window.innerWidth ? "chat" : "chatFullWidth"
      }
    >
      <ToastContainer />
      {(window.innerWidth > 900 || !currentChat) && (
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <SidebarHeading heading="Chat" />
            {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
            <div className="chatMenuScroll">
              {conversations.map((chat) => (
                <div key={chat._id} onClick={() => setCurrentChat(chat)}>
                  <Conversation conversation={chat} currentUser={state} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {(window.innerWidth > 900 || currentChat) && (
        <div className="chatBox">
          {currentChat ? (
            <div className="chatBoxWrapper">
              <ChatBar
                conversation={currentChat}
                currentUser={state}
                video={true}
                onGoBack={() => setCurrentChat(null)}
              />
              <div className="chatBoxTop">
                {messages.map((message, i) => (
                  <div key={message._id ? message._id : i} ref={scrollRef}>
                    <Message
                      own={checkOwn(message.sender._id)}
                      message={message}
                    />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <textarea
                  className="chatMessageInput"
                  placeholder="Type a new message"
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                />
              </div>
              <div className="messageSendBtn">
                <div onClick={() => onSubmitHandler()} className="submitButton">
                  <img src={SendImg} alt="Send" />
                </div>
              </div>
            </div>
          ) : (
            <div>Open a Conversation to start a chat.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Chat;
