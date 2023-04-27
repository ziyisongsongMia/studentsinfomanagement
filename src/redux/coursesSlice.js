import { createSlice } from '@reduxjs/toolkit'

export const coursesSlice = createSlice({
  name: 'studentsTable',
  initialState: {
    value: null,
  },
  reducers: {
    updateCourses: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { updateCourses } = coursesSlice.actions

export default coursesSlice.reducer
