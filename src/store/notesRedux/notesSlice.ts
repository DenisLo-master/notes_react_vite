import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { Note } from '../../interfaces/NoteProps'
import { RootState } from './store'

type stateType = {
  notes: Note[]
  loading: boolean
}

const notesSlice = createSlice({
  name: 'notes',
  initialState: <stateType>{
    notes: [],
    loading: true,
  },
  reducers: {
    addNotesToIndexedDB: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload
    },
    addOneNoteToIndexedDB: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload)
    },
  },
})

export const { addNotesToIndexedDB, addOneNoteToIndexedDB } = notesSlice.actions
export const getNotes = () => (state: RootState) => state.notes.notes

export default notesSlice.reducer
