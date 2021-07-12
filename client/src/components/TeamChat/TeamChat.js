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

  useEffect(() => {
    // When the user connects it emits it to the backend to join the room
    socket.current.emit("add user to teams", {
      userId: state._id,
      name: state.name,
      teamsId: teamId,
    });
  }, [teamId, state]);

  useEffect(() => {
    // To find teams by id
    chatApi
      .getTeamById(teamId)
      .then((result) => {
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
    // Get all the message fo the teams
    chatApi
      .getTeamsMessage(teamId)
      .then((result) => {
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

  // Check if the message is user's own
  const checkOwn = (id) => {
    return id === state._id;
  };

  // When a new message is send
  const onSubmitHandler = (e) => {
    if (!newMessage) {
      return;
    }
    const message = {
      senderId: state._id,
      text: newMessage,
      teamId,
    };

    // message send to the server to check
    chatApi
      .newMessageTeams(message)
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

    // send message to the server so that it can be broadcasted to all the user in the room
    socket.current.emit("sendMessageToTeams", {
      senderId: state._id,
      text: newMessage,
    });
  };

  useEffect(() => {
    // When a message is recieved
    socket.current.on("getMessageFromTeams", (data) => {
      const newdData = {
        sender: data.sender,
        text: data.text,
        createdAt: Date.now(),
      };
      setMessages((prev) => {
        return [...prev, newdData];
      });
    });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // When user leaves team
  const leaveHandler = (req, res) => {
    chatApi
      .leaveTeams({
        teamId: teamId,
      })
      .then((res) => {
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
