import React, { useEffect, useState, useRef } from "react";
import { nanoid } from "nanoid";
import Note from "./components/Note";
import Header from "./components/Header";
import Search from "./components/Search";

const getLocalStorage = () => {
  let savedNotes = JSON.parse(localStorage.getItem("react-notesapp-data"));
  if (savedNotes) {
    return savedNotes;
  } else {
    return [];
  }
};

function App() {
  const [notes, setNotes] = useState(getLocalStorage());
  const [noteText, setNoteText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("react-notesapp-data", JSON.stringify(notes));
  }, [notes]);

  const textRef = useRef(null);

  useEffect(() => {
    textRef.current.focus();
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!noteText) {
      alert("Please enter note to save, empty note can't be saved");
    } else if (noteText && isEditing) {
      const date = new Date();
      setNotes(
        notes.map((note) => {
          if (note.id === editId) {
            return { ...note, text: noteText, date: date.toLocaleDateString() };
          }
          return note;
        })
      );
      setNoteText("");
      setEditId(null);
      setIsEditing(false);
      textRef.current.focus();
    } else {
      const date = new Date();
      const newNote = {
        id: nanoid(),
        text: noteText,
        date: date.toLocaleDateString(),
      };
      setNotes([...notes, newNote]);
      setNoteText("");
      textRef.current.focus();
    }
  };

  const handleClearNotes = () => {
    setNotes([]);
  }

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const editNote = (id) => {
    const editedNote = notes.find((note) => note.id === id);
    setIsEditing(true);
    setEditId(id);
    setNoteText(editedNote.text);
    textRef.current.focus();
  };

  const charLimit = 200;
  
  return (
    <div className={`${darkMode ? "dark-mode" : "default-mode"}`}>
      <div className="container">
        <Header handleToggleDarkMode={setDarkMode} />
        <Search handleSearchNote={setSearchText} />
        <div className="notes-list">
          <Note
            notes={notes.filter((note) =>
              note.text.toLowerCase().includes(searchText.toLowerCase())
            )}
            deleteNote={deleteNote}
            editNote={editNote}
          />
          <div className="note new">
            <textarea
              ref={textRef}
              rows="8"
              cols="10"
              placeholder="Type to add a note..."
              onChange={(e) => {
                if (charLimit - e.target.value.length >= 0) {
                  setNoteText(e.target.value);
                }
              }}
              value={noteText}
            ></textarea>
            <div className="note-footer">
              <small>{charLimit - noteText.length} Remaining</small>
              <div>
              <button className="save " onClick={handleSave}>
                {isEditing ? "Edit" : "Save"}
              </button>
              <button className="save" onClick={handleClearNotes}>
                Clear Notes
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
