import React from "react";
import { Button, Modal } from "react-bootstrap";
// import "./sidebarHeading.css";

// import
const ModalFunction = (props) => {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      className="modalCreateTeams"
      centered
    >
      <Modal.Body closeButton className="modalCreateTeamsBody">
        <div className="modalCreateTeamsBodyHeading">{props.note.heading}</div>
        <div></div>
        <div>{props.note.description}</div>
        <div className="modalCreateTeamsBodyBtns">
          <Button
            className="modalCreateTeamsBodyCancelBtn"
            onClick={props.onHide}
          >
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const ViewNote = (props) => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <React.Fragment>
      <div className="note" onClick={() => setModalShow(true)}>
        <div className="headingNote">
          {props.note.heading.substring(
            0,
            Math.min(23, props.note.heading.length)
          )}
          {props.note.heading.length > 23 && "..."}
        </div>
        <div className="descriptionNote">
          {props.note.description.substring(
            0,
            Math.min(120, props.note.description.length)
          )}
          {props.note.description.length > 120 && "..."}
        </div>
      </div>
      <ModalFunction
        show={modalShow}
        onHide={() => setModalShow(false)}
        note={props.note}
      />
    </React.Fragment>
  );
};

export default ViewNote;
