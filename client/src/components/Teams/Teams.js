import React, { useContext, useEffect, useState } from "react";
import CreateTeams from "./CreateTeams/CreateTeam";
import JoinTeams from "./JoinTeams/JoinTeams";
import "./Teams.css";
import * as chatApi from "../../api/chatting";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import TeamsBox from "./TeamsBox/TeamsBox";

const Teams = (props) => {
  const [teams, setTeams] = useState();
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [newTeams, setNewTeams] = useState();

  const newTeamsHadler = (team) => {
    setNewTeams(team);
  };

  useEffect(() => {
    console.log(localStorage.getItem("jwt"));
    const fetchData = async () => {
      try {
        const res = await chatApi.getTeams(state._id);
        if (!res.data.status) console.log(res.data.message);
        else {
          console.log(res.data);
          setTeams(res.data.data);
          // history.push("/teams");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [state, setTeams, newTeams]);

  return (
    <div className="teams">
      <div className="teamsNav">
        <div className="teamsOnTeams">Teams</div>
        {/* <div> */}
        <div
          className="joinORCreateTeamsBTN"
          onClick={() => history.push("/createTeams")}
        >
          Join or Create Team
        </div>
        {/* </div> */}
      </div>
      {!teams || teams.length === 0 ? (
        <div className="teamsList">
          <CreateTeams newTeamsHadler={(team) => newTeamsHadler(team)} />
          <JoinTeams newTeamsHadler={(team) => newTeamsHadler(team)} />
        </div>
      ) : (
        <div className="teamsDisplay">
          {teams.map((team, id) => (
            <TeamsBox team={team} key={id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
