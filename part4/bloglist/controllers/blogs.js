const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const user = req.user
  const blog = new Blog({...req.body, user: user._id})
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({error: 'blog does not exist'})
  }
  if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(req.params.id)
      res.status(204).end()
  } else {
    return res.status(401).json({ error: 'Unauthorized' })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updatedBlog)
})

module.exports = blogsRouter