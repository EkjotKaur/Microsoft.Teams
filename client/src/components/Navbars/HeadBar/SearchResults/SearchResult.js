import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as chatApi from "../../../../api/chatting";
import { UserContext } from "../../../../App";
import "./SearchResult.css";

const SearchResults = ({ search, onClearHandler }) => {
  const [result, setResult] = useState([]);
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

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
      });
  }, []);

  console.log(result);

  const gotoConversation = (userId, userName) => {
    console.log(userId);
    chatApi
      .searchConversation({ user1: state._id, user2: userId })
      .then((result) => {
        console.log(result.data);
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
      });
  };

  return (
    <div className="SearchResults">
      {/* <div>Users</div> */}
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
    </div>
  );
};

export default SearchResults;
