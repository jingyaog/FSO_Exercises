import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

// const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = id => {
  return async (dispatch, getState) => {
    const anecdotes = getState().anecdotes
    const anecdote = anecdotes.find(a => a.id === id)
    const changedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    const newAnecdote = await anecdoteService.update(id, changedAnecdote)
    dispatch(setAnecdotes(anecdotes.map(a => a.id !== id ? a : newAnecdote)))
  }
}

export default anecdoteSlice.reducer