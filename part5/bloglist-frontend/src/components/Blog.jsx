import Togglable from './Togglable'

const Blog = ({ blog, user, incrementLikes, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = (event) => {
    event.preventDefault()
    incrementLikes(blog)
  }

  const displayRemove = { display: user.username === blog.user.username ? '' : 'none' }

  const handleDelete = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <Togglable showLabel='view' hideLabel='hide'>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
        <button onClick={handleDelete} style={displayRemove}>remove</button>
      </Togglable>
    </div>
  )
}

export default Blog