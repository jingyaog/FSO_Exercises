import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: 'initial message...',
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    removeNotification: () => null
  }
})

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer