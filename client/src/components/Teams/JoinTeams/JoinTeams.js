import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import "./JoinTeams.css";
import * as chatApi from "../../../api/chatting";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../App";

const JoinTeams = (props) => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [code, setCode] = useState();

  const JoinTeam = async () => {
    if (!code) {
      console.log("Enter Code");
      return
    }
    try {
      const res = await chatApi.joinTeam({
        memberId: state._id,
        code,
      });
      if (!res.data.status) console.log(res.data.message);
      else {
        props.newTeamsHadler(res.data.data);
        console.log(res.data);
        history.push("/teams");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="createTeams">
      <div className="createTeamsProfile"></div>
      <div className="createTeamsHeading">Join a team with a code</div>
      <div>
        <input
          placeholder="Enter code"
          className="JoinTeams"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <Button className="createTeamsBtn" onClick={JoinTeam}>
        Join Teams
      </Button>
    </div>
  );
};

export default JoinTeams;
