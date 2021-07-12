import React, { useEffect, useState } from "react";
import CreateNotesModal from "./CreateNotesModal/CreateNotesModal";
import "./Notes.css";
import * as noteApi from "../../api/note";
import { ToastContainer, toast } from "react-toastify";
import ViewNote from "./ViewNote/ViewNote";

// import

const Notes = (props) => {
  const [newNotes, setNewNotes] = useState();
  const [notes, setNotes] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);

  useEffect(() => {
    // Function to get all notes for the team
    const newFunc = async () => {
      try {
        const res = await noteApi.getNotes(props.teamsId);
        setNotes(res.data.data);
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
    newFunc();
  }, [props.teamsId]);

  useEffect(() => {
    // add new note into the notes array
    if (newNotes) setNotes((notes) => [newNotes, ...notes]);
  }, [newNotes]);

  return (
    <div className="Notes">
      <ToastContainer />
      <CreateNotesModal
        newTeamsHadler={(team) => setNewNotes(team)}
        teamsId={props.teamsId}
      />
      <div
        className={
          window.innerHeight < window.innerWidth
            ? "allNotes"
            : "allNotesFullWidth"
        }
      >
        {notes.map((note) => (
          <ViewNote note={note} />
        ))}
      </div>
    </div>
  );
};

export default Notes;
