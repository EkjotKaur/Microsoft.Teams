import React, { useContext, useEffect, useState } from "react";
import CreateTeams from "../CreateTeams/CreateTeam";
import JoinTeams from "../JoinTeams/JoinTeams";
import "./CreateTeamsPage.css";
import * as chatApi from "../../../api/chatting";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../../App";
import { ToastContainer, toast } from "react-toastify";

const CreateTeamsPage = (props) => {
  const [teams, setTeams] = useState();
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [newTeams, setNewTeams] = useState();

  const newTeamsHadler = (team) => {
    setNewTeams(team);
  };

  // Get Teams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await chatApi.getTeams(state._id);
        if (!res.data.status) console.log(res.data.message);
        else {
          console.log(res.data);
          setTeams(res.data.data);

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
      }
    };
    fetchData();
  }, [state._id, setTeams, newTeams]);

  return (
    <div
      className={
        window.innerHeight < window.innerWidth
          ? "createTeamsList"
          : "createTeamsListFullWidth"
      }
    >
      <ToastContainer />
      <CreateTeams newTeamsHadler={(team) => newTeamsHadler(team)} />
      <JoinTeams newTeamsHadler={(team) => newTeamsHadler(team)} />
    </div>
  );
};

export default CreateTeamsPage;
