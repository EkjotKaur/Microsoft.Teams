import React, { useContext, useEffect, useRef, useState } from "react";
// import "./TeamChat.css";
// import Conversation from "./Conversations/Conversations";
import Message from "../Chatting/Message/Message";
import * as chatApi from "../../api/chatting";
import { UserContext } from "../../App";
import io from "socket.io-client";
import { mainUrl } from "../../api//index";
import SidebarHeading from "../General/sidebarHeading";
import { useParams } from "react-router-dom";
import TeamLeftSide from "./TeamLeftSide/TeamLeftSide";
import SendImg from "../../assets/images/TextBox/send.png";
import ChatBar from "../General//ChatBar/ChatBar";

const TeamChat = () => {
  const { state, dispatch } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const socket = useRef(io(mainUrl));
  const scrollRef = useRef();
  const [team, setTeam] = useState();
  const teamId = useParams().teamId;
  console.log(teamId);

  useEffect(() => {
    socket.current.emit("add user to teams", {
      userId: state._id,
      name: state.name,
      teamsId: teamId,
    });
  }, [teamId, state]);

  useEffect(() => {
    // console.log(state._id);
    chatApi
      .getTeamById(teamId)
      .then((result) => {
        console.log(result);
        if (result.data.state == "false") console.log(result.data.message);
        else {
          setTeam(result.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    chatApi
      .getTeamsMessage(teamId)
      .then((result) => {
        console.log(result.data);
        if (result.data.status == "false") console.log(result.data.message);
        else setMessages(result.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [teamId]);

  const checkOwn = (id) => {
    return id === state._id;
  };

  const onSubmitHandler = (e) => {
    if(!newMessage){
      return;
    }
    console.log("Sending");
    const message = {
      senderId: state._id,
      text: newMessage,
      teamId,
    };

    // const receiver = currentChat.members.find(
    //   (memeber) => memeber._id !== state._id
    // );

    chatApi
      .newMessageTeams(message)
      .then((result) => {
        console.log(result);
        // if (result.data.room == teamId)
        setMessages([...messages, result.data.data]);
        setNewMessage("");
      })
      .catch((err) => {
        console.log(err);
      });
    socket.current.emit("sendMessageToTeams", {
      senderId: state._id,
      text: newMessage,
    });
  };

  useEffect(() => {
    socket.current.on("getMessageFromTeams", (data) => {
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

  //   console.log(messages);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat">
      {window.innerWidth > 900 && <div className="chatMenu">
        <div className="chatMenuWrapper">
          <SidebarHeading heading="Team" />
          {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
          {team && <TeamLeftSide team={team} />}
        </div>
      </div>}
      <div className="chatBox">
        <div className="chatBoxWrapper">
          <ChatBar team={team} currentUser={state} video={true} />
          <div className="chatBoxTop">
            {messages.map((message, i) => (
              <div key={message._id ? message._id : i} ref={scrollRef}>
                <Message own={checkOwn(message.sender._id)} message={message} />
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
      </div>
    </div>
  );
};

export default TeamChat;
