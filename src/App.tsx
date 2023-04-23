
import React, { useState } from 'react'

import { useState } from 'react'
import './App.css'
import { Workspace } from './components/Workspace'
import { LayoutProvider } from './hooks/useLayoutContext'
import { firebaseApp } from './store/firebase.config'
import { Note } from './interfaces/NoteProps'
import { Navigate, Route, Routes } from 'react-router'
import { AuthLayout } from './layouts/AuthLayout'
import { PrivateRoute } from './layouts/PrivateRoute'
import { db } from './store/action/indexDB'

export function App() {
  firebaseApp.auth()
  db.open().catch(err => {
    console.error(`Ошибка открытия базы данных: ${err.stack || err}`);
  });

  return (

    <div>

    </div>
  )
}
