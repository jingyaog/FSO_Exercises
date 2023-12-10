const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }
  const blog = blogs.reduce((acc, cur) => {
    return cur.likes >= acc.likes ? cur : acc
  }, blogs[0])

  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {}
  }

  const groupedBlogs = _.groupBy(blogs, blog => blog.author)
  const authors = _.mapValues(groupedBlogs, blogs => blogs.length)

  return _.entries(authors).reduce((acc, [author, blogs]) => {
    console.log(author, blogs)
    return blogs > acc.blogs ? { author: author, blogs: blogs } : acc
  }, { author: null, blogs: 0 })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}