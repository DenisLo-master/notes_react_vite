import { combineReducers, configureStore } from '@reduxjs/toolkit'
import notesSlice from './notesSlice'

const rootReduser = combineReducers({
  notes: notesSlice,
})

export const store = configureStore({
  reducer: rootReduser,
})
