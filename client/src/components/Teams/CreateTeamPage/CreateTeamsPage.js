import React, { useContext, useEffect, useState } from "react";
import CreateTeams from "../CreateTeams/CreateTeam";
import JoinTeams from "../JoinTeams/JoinTeams";
import "./CreateTeamsPage.css";
import * as chatApi from "../../../api/chatting";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../App";

const CreateTeamsPage = (props) => {
  const [teams, setTeams] = useState();
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [newTeams, setNewTeams] = useState();

  const newTeamsHadler = (team) => {
    setNewTeams(team);
  };

  useEffect(() => {
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
  }, [state._id, setTeams, newTeams]);

  return (
    <div className="createTeamsList">
      <CreateTeams newTeamsHadler={(team) => newTeamsHadler(team)} />
      <JoinTeams newTeamsHadler={(team) => newTeamsHadler(team)} />
    </div>
  );
};

export default CreateTeamsPage;
