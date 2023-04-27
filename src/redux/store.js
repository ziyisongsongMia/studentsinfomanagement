import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice.js'
import studentsReducer from './studentsSlice.js'
import coursesReducer from './coursesSlice.js'
import currentUserReducer from './currentUserSlice.js'

export const store = configureStore({
  reducer: {
    user: userReducer,
    studentsTable: studentsReducer,
    coursesTable: coursesReducer,
    currentUser: currentUserReducer,
  },
})
