import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    set(state, action) {
      return action.payload
    },
    remove: () => null
  }
})

export const { set, remove } = notificationSlice.actions

export const setNotification = (notification, time) => {
  return dispatch => {
    dispatch(set(notification))
    setTimeout(() => {
      dispatch(remove())
    }, time * 1000)
  }
}
export default notificationSlice.reducer