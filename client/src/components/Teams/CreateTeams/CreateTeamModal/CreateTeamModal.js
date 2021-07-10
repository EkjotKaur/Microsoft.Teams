import React, { useContext, useState } from "react";
import "./CreateTeamModal.css";
import { UserContext } from "../../../../App";
import * as chatApi from "../../../../api/chatting";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

const CreateTeamsModal = (props) => {
  return <New newTeamsHadler={(team) => props.newTeamsHadler(team)} />;
};

const MyVerticallyCenteredModal = (props) => {
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const createTeam = async () => {
    if (!name) {
      console.log("Enter Name");
    }
    try {
      const res = await chatApi.createTeam({
        creatorId: state._id,
        name,
        description,
      });
      if (!res.status) console.log(res.message);
      else {
        props.newTeamsHadler(res.data.data);
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
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="modalCreateTeams"
      centered
    >
      <Modal.Body closeButton className="modalCreateTeamsBody">
        <div className="modalCreateTeamsBodyHeading">Create your team</div>
        <div className="modalCreateTeamsBodyPara">
          Collaborate closely with a group of people inside your organization
          based on project, initiative, or common interest.
        </div>
        <div>
          <div className="inputCreateTeamLabel">Team Name</div>
          <input
            className="inputCreateTeam"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div>
          <div className="inputCreateTeamLabel">Description</div>
          <textarea
            className="inputCreateTeam"
            placeholder="Let people know what team is this about"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
        </div>
        <div className="modalCreateTeamsBodyBtns">
          <Button
            className="modalCreateTeamsBodyCancelBtn"
            onClick={props.onHide}
          >
            Cancel
          </Button>
          <Button
            className="modalCreateTeamsBodySubmit"
            disabled={!name}
            onClick={createTeam}
          >
            Create
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

function New(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <ToastContainer />
      <Button
        className="createTeamsModalBtn"
        onClick={() => setModalShow(true)}
      >
        Create Team
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        newTeamsHadler={(team) => props.newTeamsHadler(team)}
        onHide={() => setModalShow(false)}
      />
    </>
  );
}

export default CreateTeamsModal;
