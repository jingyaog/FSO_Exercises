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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}