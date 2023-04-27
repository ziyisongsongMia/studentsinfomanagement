import { createSlice } from '@reduxjs/toolkit'

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
    value: null,
  },
  reducers: {
    updateCurrentUser: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { updateCurrentUser } = currentUserSlice.actions

export default currentUserSlice.reducer
