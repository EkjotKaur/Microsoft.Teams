import React, { useContext, useEffect, useState } from "react";
import CreateTeams from "./CreateTeams/CreateTeam";
import JoinTeams from "./JoinTeams/JoinTeams";
import "./Teams.css";
import * as chatApi from "../../api/chatting";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import TeamsBox from "./TeamsBox/TeamsBox";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../General/Loading/Loading";

const Teams = (props) => {
  const [teams, setTeams] = useState();
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [newTeams, setNewTeams] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const newTeamsHadler = (team) => {
    setNewTeams(team);
  };

  useEffect(() => {
    // Getting all the teams for the user from the server
    const fetchData = async () => {
      try {
        const res = await chatApi.getTeams(state._id);
        if (!res.data.status) console.log(res.data.message);
        else {
          setTeams(res.data.data);
          setIsLoading(false);
        }
      } catch (err) {
        console.log(err);
        toast(
          `${
            err.response && err.response.data
              ? err.response.data.message
              : "Something went wrong."
          }`
        );
        setIsLoading(false);
      }
    };
    fetchData();
  }, [state, setTeams, newTeams]);

  if (isLoading) return <Loading />;
  return (
    <div
      className={
        window.innerHeight < window.innerWidth ? "teams" : "teamsFullWidth"
      }
    >
      <ToastContainer />
      <div className="teamsNav">
        <div className="teamsOnTeams">Teams</div>
        <div
          className="joinORCreateTeamsBTN"
          onClick={() => history.push("/createTeams")}
        >
          Join or Create Team
        </div>
      </div>
      {!teams || teams.length === 0 ? (
        <div
          className={
            window.innerHeight < window.innerWidth
              ? "createTeamsList"
              : "createTeamsListFullWidth"
          }
        >
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
