const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('../tests/test_helper')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('getting blogs', () => {
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
  test('a new blog can be added', async () => {
    const newBlog = {
      title: "New Blog 0",
      author: "Aaron 0",
      url: "http://www.4300.com",
      likes: 10
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
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
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})