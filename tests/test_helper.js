const Blog = require('../models/blog')
const User = require('../models/user')

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
    {
        title: 'How to make breakfast',
        author: 'Cindy Crawlings',
        url: 'https://blogposts.com/breakfast',
        likes: 10,
        id: '63ff0b871f089601a03ae716'
    },
    {
        title: 'How to make desserts',
        author: 'Cindy Crawlings',
        url: 'https://blogposts.com/desserts',
        likes: 10,
        id: '63ff0b871f089601a03ae716'
    }
]

const usersList = {
    initialUser : {
        username: 'root',
        name: 'Vincent',
        password: '01234'
    },
    secondUser: {
        username: 'admin',
        name: 'Mia',
        password: 'abcd'
    },
    noUsernameUser: {
        name: 'Sarah',
        password: 'ABCD'
    },
    noPasswordUser: {
        username: 'admin',
        name: 'Sarah',
    },
    incorrectNameUser: {
        username: 'db',
        name: 'John',
        password: 'abcd'
    },
    incorrectPasswordUser: {
        username: 'admin',
        password: '12'
    }
}


const blogPostsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialBlogs,
    usersList,
    blogPostsInDb,
    usersInDb,
}