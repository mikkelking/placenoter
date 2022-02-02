import { Container, Link } from '@nextui-org/react';
import React, { EffectCallback, useContext, useEffect, useState } from 'react';
import { Maintop, Sidebar, Tiptap } from './components';
import { Context, ContextInterface } from './Context';
import { Note } from './types';
import { v4 as uuidv4 } from 'uuid'

const { storage } = chrome

const Main = () => {
  const { sidebarActive, activeNote, setActiveNote, notes, setNotes } = useContext(Context) as ContextInterface

  const [notesFetchedFromDb, setNotesFetchedFromDb] = useState(false)

  const useMountEffect = (fun: EffectCallback) => useEffect(fun, [])

  // finds activeNote and Updates it
  useEffect(() => {
    if (!activeNote) return
    const { id } = activeNote

    const noteIndex = notes.findIndex((n) => n?.id === id)
    const foundNote = notes[noteIndex]

    if (activeNote.content === foundNote.content && activeNote.title === foundNote.title) return

    const copyOfNotes = [...notes.slice()]

    copyOfNotes[noteIndex] = activeNote

    setNotes(copyOfNotes)

  }, [activeNote])

  useEffect(() => {
    if (notesFetchedFromDb) storage.sync.set({ dbnotes: notes })
  }, [notes])


  const createNewNoteAndSetItAsActiveNote = () => {
    // debugger
    const newNote: Note = {
      id: uuidv4(),
      content: '',
      timestamp: new Date(),
      title: '',
      textContent: ''
    }

    setActiveNote(JSON.parse(JSON.stringify(newNote)))

    setNotes([...notes, newNote])
  }

  const fetchNotesFromSyncStorage = () => {
    storage.sync.get('dbnotes', ({ dbnotes }) => {
      // debugger
      if (dbnotes) setNotes(dbnotes)
      else storage.sync.set({ dbnotes: [] })

      setNotesFetchedFromDb(true)
    })
  }

  useMountEffect(fetchNotesFromSyncStorage)

  const onCreateNewNoteClicked = (e: React.MouseEvent<unknown, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()

    createNewNoteAndSetItAsActiveNote()
  }

  const setNoteContent = (content: string, textContent: string) => {
    if (typeof content === 'string') content = content.trim()

    debugger
    setActiveNote({ ...activeNote, content, textContent })
  }

  const updateActiveNoteTitle = (title: string) => {
    const updatedActiveNote = { ...activeNote, title }
    setActiveNote(JSON.parse(JSON.stringify(updatedActiveNote)))
  }

  return (
    <main className="placenoter">
      <Sidebar />

      <section className={`note-content h-full ${!sidebarActive ? 'full' : ''}`}>
        <Maintop updateActiveNoteTitle={updateActiveNoteTitle} />

        {
          activeNote?.id ?
            (
              <main className='editor-area'>
                <Container sm>
                  <Tiptap content={activeNote.content} onUpdate={setNoteContent} />
                </Container>
              </main>
            ) : (
              <main className='no-note-selected flex h-full'>
                <h1> No Note selected </h1>

                <h3 className='flex'>
                  Select or <Link onClick={(e) => onCreateNewNoteClicked(e)} > &nbsp; create a new &nbsp; </Link>  note.
                </h3>
              </main>
            )
        }


      </section>
    </main>
  )
}

export default Main