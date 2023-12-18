import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('form calls the event handler with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'testing a form...')
    await user.type(authorInput, 'Jane Doe')
    await user.type(urlInput, 'www.test.com')
    await user.click(submitButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
    expect(createBlog.mock.calls[0][0].author).toBe('Jane Doe')
    expect(createBlog.mock.calls[0][0].url).toBe('www.test.com')
  })
})