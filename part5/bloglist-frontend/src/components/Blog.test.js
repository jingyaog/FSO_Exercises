import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
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
  const blogUser = {
    username: 'Test user 1',
    name: 'Test'
  }

  const mockLikeHandler = jest.fn()
  const mockDeleteHandler = jest.fn()

  test('renders the blog\'s title and author but not URL or number of likes', () => {
    const { container } = render(
      <Blog blog={blog} user={blogUser}
        incrementLikes={mockLikeHandler}
        deleteBlog={mockDeleteHandler}
      />
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

  test('blog\'s URL and number of likes are shown when button is clicked', async () => {
    const { container } = render(
      <Blog blog={blog} user={blogUser}
        incrementLikes={mockLikeHandler}
        deleteBlog={mockDeleteHandler}
      />
    )

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const urlDiv = container.querySelector('.url')
    const likesDiv = container.querySelector('.likes')

    expect(urlDiv).toBeVisible()
    expect(likesDiv).toBeVisible()

    const hideButton = screen.getByText('hide')
    await user.click(hideButton)

    expect(urlDiv).not.toBeVisible()
    expect(likesDiv).not.toBeVisible()
  })

  test('event handler is called twice when like button is clicked twice', async () => {
    const { container } = render(
      <Blog blog={blog} user={blogUser}
        incrementLikes={mockLikeHandler}
        deleteBlog={mockDeleteHandler}
      />
    )

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
