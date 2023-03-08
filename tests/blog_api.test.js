const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('the correct amout of blogs is returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is name id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})

test('making POST request generates new blog post', async () => {
    const newBlogPost = {
        title: '10 ways to learn React',
        author: 'Ferdinand Marques',
        url: 'https://blogposts.com/10-ways-learn-react',
        likes: 2
    }

    await api
        .post('/api/blogs')
        .send(newBlogPost)
        .expect(201)

    const blogPostsAtEnd = await helper.blogPostsInDb()
    expect(blogPostsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
})

test('if the likes property is missing from the request, it defaults to 0', async () => {
    const newBlogPost = {
        title: 'Best apps to create blog posts',
        author: 'Sarah Merlens',
        url: 'https://blogposts.com/best-apps-blog-posts',
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlogPost)
        .expect(201)

    expect(response.body.likes).toBe(0)
})

test('if title or url properties are missing, response is 400', async () => {
    const blogPostNoTitle = {
        author: 'Sarah Merlens',
        url: 'https://blogposts.com/best-apps-blog-posts',
    }

    const blogPostNoURL = {
        title: 'Best apps to create blog posts',
        author: 'Sarah Merlens',
    }

    await api
        .post('/api/blogs')
        .send(blogPostNoTitle)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(blogPostNoURL)
        .expect(400)
})

test('deletion succeeds with status 204 if id is valid', async () => {
    const blogPosts = await helper.blogPostsInDb()

    const blogToDelete = blogPosts[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogPostsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const contents = blogsAtEnd.map(blog => blog.title)
    expect(contents).not.toContain(blogToDelete.tile)
})

test('updating likes of a blog post succeeds', async () => {
    const blogPosts = await helper.blogPostsInDb()
    const blogToUpdate = blogPosts[0]

    blogToUpdate.likes += 1

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

    expect(response.body).toEqual(blogToUpdate)
})

afterAll(async () => {
    await mongoose.connection.close()
})