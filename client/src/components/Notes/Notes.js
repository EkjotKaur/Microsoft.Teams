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
  console.log(props.teamsId);

  useEffect(() => {
    const newFunc = async () => {
      try {
        const res = await noteApi.getNotes(props.teamsId);
        setNotes(res.data.data);
        console.log(res.data);
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
    if (newNotes) setNotes((notes) => [newNotes, ...notes]);
  }, [newNotes]);

  console.log(notes);

  return (
    <div className="Notes">
      <ToastContainer />
      <CreateNotesModal
        newTeamsHadler={(team) => setNewNotes(team)}
        teamsId={props.teamsId}
      />
      <div className={window.innerHeight < window.innerWidth ? "allNotes" : "allNotesFullWidth"}>
        {notes.map((note) => (
          <ViewNote note={note} />
        ))}
      </div>
    </div>
  );
};

export default Notes;
