const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'How to write a blog post',
        author: 'Jimmy Fletcher',
        url: 'https://blogposts.com/write-blog-post',
        likes: 5
    },
    {
        title: 'How to fetch a blog post',
        author: 'Jeremy Loggins',
        url: 'https://blogposts.com/fetch-blog-post',
        likes: 55
    },
]

const blogPostsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs,
    blogPostsInDb
}