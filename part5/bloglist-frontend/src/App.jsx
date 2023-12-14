import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [style, setStyle] = useState('success')

  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setStyle('success')
      setMessage(`${user.name} successfully logged in`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('wrong username or password')
      setStyle('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.clear()
    setStyle('success')
    setMessage('successfully logged out')
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      createdBlog.user = user
      setBlogs(blogs.concat(createdBlog))
      setStyle('success')
      setMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception.response.data.error)
      setStyle('error')
      setMessage(exception.response.data.error)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const incrementLikes = async (blog) => {
    try {
      const newBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: blog.user.id,
        likes: blog.likes + 1
      }
      const updatedBlog = await blogService.update(blog.id, newBlog)
      let newBlogs = [...blogs]
      const index = newBlogs.findIndex(b => b.id === updatedBlog.id)
      newBlogs[index].likes++
      setBlogs(newBlogs.sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      console.log(exception.response.data.error)
    }
  }

  const deleteBlog = async (blog) => {
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch (exception) {
      console.log(exception)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} style={style} />
        <Togglable showLabel='log in' hideLabel='cancel'>
          <LoginForm handleLogin={handleLogin} />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} style={style} />
      <div>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>
      
      <Togglable showLabel='new blog' hideLabel='cancel'>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} user={user}
            incrementLikes={incrementLikes}
            deleteBlog={deleteBlog} />
        )}
      </div>
    </div>
  )
}

export default App