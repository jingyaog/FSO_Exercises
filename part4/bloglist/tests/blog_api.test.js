const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../tests/test_helper')

describe('getting blogs', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('creating blogs', () => {

  let authorization

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    const user = {
      username: 'root',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(user)

    const response = await api
      .post('/api/login')
      .send(user)

    authorization = `bearer ${response.body.token}`
  })

  test('a new blog can be added', async () => {
    const newBlog = {
      title: "New Blog 0",
      author: "Aaron 0",
      url: "http://www.4300.com",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain('New Blog 0')
  })

  test('if the likes property is missing it will default to 0', async () => {
    const newBlog = {
      title: "New Blog 1",
      author: "Aaron 1",
      url: "http://www.4301.com"
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(200)

    expect(response.body.likes).toBe(0)
  })

  test('blog without title is not added', async () => {
    const newBlog = {
      author: "Aaron 2",
      url: "http://www.4302.com",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: "New Blog 3",
      author: "Aaron 3",
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('adding a blog fails if a token is not provided', async () => {
    const newBlog = {
      title: "New Blog 0",
      author: "Aaron 0",
      url: "http://www.4300.com",
      likes: 10
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('token missing')

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})


describe('deleting blogs', () => {

  let authorization

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    const user = {
      username: 'root',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(user)

    const response = await api
      .post('/api/login')
      .send(user)

    authorization = `bearer ${response.body.token}`
  })

  test('a blog can be deleted', async () => {

    const newBlog = {
      title: "New Blog 0",
      author: "Aaron 0",
      url: "http://www.4300.com",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)

    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart.find(b => b.title === newBlog.title)
  
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', authorization)
      .expect(204)
  
    const blogsAtEnd = await helper.blogsInDb()
  
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )
  
    const titles = blogsAtEnd.map(b => b.title)
  
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('updating blogs', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  test('number of likes can be updated correctly', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }
  
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
  
    const newBlog = await Blog.findById(blogToUpdate.id)
    expect(newBlog.toJSON().likes).toBe(blogToUpdate.likes + 1)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})