import React, { useState, useRef, useEffect } from 'react'
import Header from './compounds/Header'
import InputArea from './compounds/InputArea'
import Note from './compounds/Note'
import PanelFiles from './compounds/PanelFiles'


import './styles/App.css'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import './styles/NoteAnimation.css'

function App() {
  const [notes, setNotes] = useState([])
  const notifyTitle = () => toast.error("You must add a title!")
  const notifyText = () => toast.error("You must add some text!")
  const notifyInvalidNotes = (count) => toast.error(`${count} notes were not added because they are invalid.`);



  const nodeRefs = useRef({})

  useEffect(() => {
    Object.keys(nodeRefs.current).forEach(id => {
      if (!notes.find(note => note.id.toString() === id)) {
        delete nodeRefs.current[id]
      }
    })
  }, [notes])

  function addNote(note) {
    if (note.title.trim() === '') {
      notifyTitle()
      return
    }
    if (note.text.trim() === '') {
      notifyText()
      return
    }
    const newNote = { ...note, id: Date.now() }
    setNotes(prevNotes => [...prevNotes, newNote])
  }

  function handleDelete(id) {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id))
  }

  function handlePanelClick(target) {
    if (target === 'download') {
      if (notes.length > 0) {
        console.log(`${notes.length} Notes available for download:`)
        const json = JSON.stringify(notes,null,2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.json';
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }

  function handleFileUpload(data) {
  if (!Array.isArray(data)) {
    alert("The file does not contain a valid array.");
    return;
  }

  let invalidCount = 0;

  const validNotes = data.filter(note => {
    const keys = Object.keys(note);
    if (keys.length !== 3 || !keys.includes('title') || !keys.includes('text') || !keys.includes('id')) {
      invalidCount++;
      return false;
    }
    
    if (
      typeof note.title !== 'string' ||
      note.title.trim() === '' ||
      typeof note.text !== 'string' ||
      note.text.trim() === '' ||
      !Number.isInteger(note.id)
    ) {
      invalidCount++;
      return false;
    }

    return true;
  });

  if (validNotes.length === 0) {
    alert("There are no valid notes in the file.");
    return;
  }

  if (invalidCount > 0) {
    notifyInvalidNotes(invalidCount);
  }

  setNotes(prevNotes => [...prevNotes, ...validNotes]);
}


  return (
    <>
      <Header />
      <div className="contentApp">
        <InputArea onAdd={addNote} />
        <div className="notesWrapper">
          <TransitionGroup className="notesWrapper">
            {notes.map(note => {
              if (!nodeRefs.current[note.id]) {
                nodeRefs.current[note.id] = React.createRef()
              }
              return (
                <CSSTransition
                  key={note.id}
                  timeout={300}
                  classNames="note"
                  nodeRef={nodeRefs.current[note.id]}
                >
                  <Note
                    ref={nodeRefs.current[note.id]}
                    id={note.id}
                    title={note.title}
                    text={note.text}
                    onDelete={handleDelete}
                  />
                </CSSTransition>
              )
            })}
          </TransitionGroup>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    <PanelFiles 
      onIconClick={handlePanelClick}
      onFileUpload={handleFileUpload}
    />
    </>
  )
}

export default App
