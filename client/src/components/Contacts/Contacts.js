import React, { useContext, useEffect, useReducer, useState } from "react";
import "./Contacts.css";
import * as chatApi from "../../api/chatting";
import { UserContext } from "../../App";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../General/Loading/Loading";

// import

const Contacts = (props) => {
  const [contacts, setContacts] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  // Check if the conversation exists between the users or not
  const gotoConversation = (userId, userName) => {
    console.log(userId);
    chatApi
      .searchConversation({ user1: state._id, user2: userId })
      .then((result) => {
        console.log(result.data);
        if (result.data.state == "false") console.log(result.data.message);
        else {
          if (result.data.data) {
            history.push(`/chat/${result.data.data._id}`);
          } else {
            history.push(`/newChat/${userId}/${userName}`);
          }
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
  };

  // Get all the contacts from the backend
  useEffect(() => {
    chatApi
      .getContactFromTeams(state._id)
      .then((result) => {
        if (result.data.status == "false") {
          console.log(result.data.message);
          return;
        }
        setContacts(result.data.data);
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

  if(isLoading) return <Loading />
  return (
    <div
      className={
        window.innerHeight < window.innerWidth ? "Contacts" : "ContactFullWidth"
      }
    >
      <div className="contactOnContacts">Contacts</div>
      <div className="allContacts">
        {contacts &&
          contacts.map((contact) => (
            <div
              key={contact._id}
              className="ContactItem"
              onClick={() => gotoConversation(contact._id, contact.name)}
            >
              <div className="ContactItemName">{contact.name}</div>
              <div className="ContactItemEmail">{contact.email}</div>
            </div>
          ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Contacts;
