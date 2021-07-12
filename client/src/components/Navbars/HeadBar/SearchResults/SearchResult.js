import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as chatApi from "../../../../api/chatting";
import { UserContext } from "../../../../App";
import "./SearchResult.css";
import { ToastContainer, toast } from "react-toastify";

const SearchResults = ({ search, onClearHandler }) => {
  const [result, setResult] = useState();
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  // Function to search all the contacts
  // Contacts means all the users that exits in any of the teams
  useEffect(() => {
    chatApi
      .searchContactFromTeams({ name: search }, state._id)
      .then((result) => {
        if (result.data.state == "false") console.log(result.data.message);
        else {
          setResult(result.data.data);
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
  }, [search]);


  // To check if conversation exists between the users
  const gotoConversation = (userId, userName) => {
    chatApi
      .searchConversation({ user1: state._id, user2: userId })
      .then((result) => {
        if (result.data.state == "false") console.log(result.data.message);
        else {
          onClearHandler();
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

  return (
    <div className="SearchResults">
      {/* <div>Users</div> */}
      <ToastContainer />
      {result &&
        result.map((user) => (
          <div
            key={user._id}
            className="SearchUserDetails"
            onClick={() => gotoConversation(user._id, user.name)}
          >
            <div className="SearchUserDetailsName">{user.name}</div> •
            <div className="SearchUserDetailsEmail">{user.email}</div>
          </div>
        ))}
      {result && result.length < 1 && (
        <div className="SearchUserDetails">
          <div className="SearchUserDetailsEmail">No User Found</div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
