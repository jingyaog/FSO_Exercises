import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders the blog\'s title and author but not URL or number of likes', () => {
  const blog = {
    title: 'Test blog 1',
    author: 'Aaron',
    url: 'http://www.test.com',
    likes: 3,
    user: {
      username: 'Test user 1',
      name: 'Test'
    }
  }
  const user = {
    username: 'Test user 1',
    name: 'Test'
  }

  const mockHandler = jest.fn()

  const { container } = render(
    <Blog blog={blog} user={user} incrementLikes={mockHandler} deleteBlog={mockHandler} />
  )

  const titleElement = screen.queryByText('Test blog 1', { exact: false })
  const authorElement = screen.queryByText('Aaron', { exact: false })
  expect(titleElement).toBeVisible()
  expect(authorElement).toBeVisible()

  const urlDiv = container.querySelector('.url')
  expect(urlDiv).not.toBeVisible()

  const likesDiv = container.querySelector('.likes')
  expect(likesDiv).not.toBeVisible()
})