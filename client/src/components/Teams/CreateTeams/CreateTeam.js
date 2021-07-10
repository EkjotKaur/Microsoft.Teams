import React, { useContext } from "react";
import Profile1 from "../../../assets/images/Teams/user.png";
import Profile2 from "../../../assets/images/Teams/user (1).png";
import "./CreateTeams.css";
import { UserContext } from "../../../App";
import * as chatApi from "../../../api/chatting";
import { useHistory } from "react-router-dom";
import CreateTeamsModal from "./CreateTeamModal/CreateTeamModal";
import { ToastContainer, toast } from "react-toastify";

const CreateTeams = (props) => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const createTeam = async () => {
    try {
      const res = await chatApi.createTeam({
        creatorId: state._id,
      });
      if (!res.status) console.log(res.message);
      else {
        history.push("/teams");
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

  return (
    <div className="createTeams">
      <ToastContainer />
      <div className="createTeamsProfile"></div>
      <div className="createTeamsHeading">Create a Teams</div>
      <div>
        <img className="createTeamsProfileImg" src={Profile1} alt="" />
        <img className="createTeamsProfileImg" src={Profile2} alt="" />
        <img className="createTeamsProfileImg" src={Profile1} alt="" />
      </div>
      {/* <button className="createTeamsBtn">Create Teams</button> */}
      <CreateTeamsModal newTeamsHadler={(team) => props.newTeamsHadler(team)} />
    </div>
  );
};

export default CreateTeams;
