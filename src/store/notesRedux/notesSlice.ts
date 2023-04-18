import { createSlice } from '@reduxjs/toolkit'

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
  },
  reducers: {
    addNotesToIndexedDB: (state, action) => {
      state.notes = action.payload
    },
  },
})

export default notesSlice.reducer
export const { addNotesToIndexedDB } = notesSlice.actions
