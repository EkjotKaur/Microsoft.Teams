import React, { useContext, useEffect, useRef, useState } from "react";
// import "./TeamChat.css";
// import Conversation from "./Conversations/Conversations";
import Message from "../Chatting/Message/Message";
import * as chatApi from "../../api/chatting";
import { UserContext } from "../../App";
import io from "socket.io-client";
import { mainUrl } from "../../api//index";
import SidebarHeading from "../General/sidebarHeading";
import { useHistory, useParams } from "react-router-dom";
import TeamLeftSide from "./TeamLeftSide/TeamLeftSide";
import SendImg from "../../assets/images/TextBox/send.png";
import ChatBar from "../General//ChatBar/ChatBar";
import { ToastContainer, toast } from "react-toastify";
import Notes from "../Notes/Notes";
import Loading from "../General/Loading/Loading";

const TeamChat = () => {
  const { state, dispatch } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const socket = useRef(io(mainUrl));
  const scrollRef = useRef();
  const [team, setTeam] = useState();
  const teamId = useParams().teamId;
  const [active, setActive] = useState("Chat");
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
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
        setIsLoading(false);
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
        setIsLoading(false);
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
        toast(
          `${
            err.response && err.response.data
              ? err.response.data.message
              : "Something went wrong."
          }`
        );
      });
  }, [teamId]);

  const checkOwn = (id) => {
    return id === state._id;
  };

  const onSubmitHandler = (e) => {
    if (!newMessage) {
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
        toast(
          `${
            err.response && err.response.data
              ? err.response.data.message
              : "Something went wrong."
          }`
        );
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

  const leaveHandler = (req, res) => {
    chatApi
      .leaveTeams({
        teamId: teamId,
      })
      .then((res) => {
        console.log(res.data);
        history.push("/teams");
      })
      .catch((err) => {
        console.log(err);
        toast(
          `${
            err.response && err.response.data && err.response.data.message
              ? err.response.data.message
              : "Something went wrong."
          }`
        );
      });
  };

  if (isLoading) return <Loading />;
  return (
    <div
      className={
        window.innerHeight < window.innerWidth ? "chat" : "chatFullWidth"
      }
    >
      <ToastContainer />
      {window.innerWidth > 900 && (
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <SidebarHeading heading="Team" />
            {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
            {team && <TeamLeftSide team={team} />}
          </div>
        </div>
      )}
      <div className="chatBox">
        <div className="chatBoxWrapper">
          <ChatBar
            team={team}
            currentUser={state}
            video={true}
            onChangeTab={(type) => setActive(type)}
            tabs={true}
            active={active}
            leave={true}
            onLeave={() => leaveHandler()}
          />
          {active === "Chat" && (
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
          )}
          {active === "Chat" && (
            <div className="chatBoxBottom">
              <textarea
                className="chatMessageInput"
                placeholder="Type a new message"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
            </div>
          )}
          {active === "Chat" && (
            <div className="messageSendBtn">
              <div onClick={() => onSubmitHandler()} className="submitButton">
                <img src={SendImg} alt="Send" />
              </div>
            </div>
          )}
          {active === "Notes" && <Notes teamsId={teamId} />}
        </div>
      </div>
    </div>
  );
};

export default TeamChat;
