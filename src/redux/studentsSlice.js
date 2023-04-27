import { createSlice } from '@reduxjs/toolkit'

export const studentsSlice = createSlice({
  name: 'studentsTable',
  initialState: {
    value: null,
  },
  reducers: {
    updateStudents: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { updateStudents } = studentsSlice.actions

export default studentsSlice.reducer
