import React, { useContext, useState } from "react";
import "./CreateNotesModal.css";
import { UserContext } from "../../../App";
import * as notesApi from "../../../api/note";
import { useHistory } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

// Create new notes
const CreateNotesModal = (props) => {
  return (
    <New
      newTeamsHadler={(team) => props.newTeamsHadler(team)}
      teamsId={props.teamsId}
    />
  );
};

//  Modal
const MyVerticallyCenteredModal = (props) => {
  const [heading, setHeading] = useState();
  const [description, setDescription] = useState();
  const history = useHistory();

  // Function to create notes
  const createTeam = async () => {
    console.log(heading, description);
    if (!heading || !description) {
      console.log("Enter Name");
      toast("Enter all the details");
    }

    try {
      const res = await notesApi.createNotes({
        teamId: props.teamsId,
        heading,
        description,
      });
      props.newTeamsHadler(res.data.data);
      setHeading();
      setDescription();
      props.onHide();
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
        <div className="modalCreateTeamsBodyHeading">Create new note</div>
        <div>
          <div className="inputCreateTeamLabel">Note Heading</div>
          <input
            className="inputCreateTeam"
            type="text"
            onChange={(e) => setHeading(e.target.value)}
            value={heading}
          />
        </div>
        <div>
          <div className="inputCreateTeamLabel">Description</div>
          <textarea
            className="inputCreateTeam"
            placeholder="Add some description ...."
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
            disabled={!heading || !description}
            onClick={() => createTeam()}
          >
            Create
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

// Function to active and close modal
function New(props) {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <>
      <ToastContainer />
      <Button
        className="createTeamsModalBtn createTeamsNotesBtn "
        onClick={() => setModalShow(true)}
      >
        Create Notes +
      </Button>

      <MyVerticallyCenteredModal
        show={modalShow}
        newTeamsHadler={(team) => props.newTeamsHadler(team)}
        onHide={() => setModalShow(false)}
        teamsId={props.teamsId}
      />
    </>
  );
}

export default CreateNotesModal;
