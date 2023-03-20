const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const initialUser = helper.usersList.initialUser
const secondUser = helper.usersList.secondUser
let initialToken, secondToken
let initialUserId

beforeAll(async () => {
    await User.deleteMany({})

    const newUserResult = await api
        .post('/api/users')
        .send(initialUser)

    initialUserId = newUserResult.body.id

    const initialLoginResult = await api
        .post('/api/login')
        .send({
            username: initialUser.username,
            password: initialUser.password
        })

    initialToken = initialLoginResult.body.token

    await api
        .post('/api/users')
        .send(secondUser)

    const secondLoginResult = await api
        .post('/api/login')
        .send({
            username: secondUser.username,
            password: secondUser.password
        })

    secondToken = secondLoginResult.body.token
})

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => {
        blog.user = initialUserId
        return blog.save()
    })
    await Promise.all(promiseArray)
})

describe('basic creation operations', () => {
    test('the correct amout of blogs is returned', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${initialToken}`)
    
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    
    test('unique identifier property of the blog posts is name id', async () => {
        const response = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${initialToken}`)
    
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
            .set('Authorization', `Bearer ${initialToken}`)
            .send(newBlogPost)
            .expect(201)
    
        const blogPostsAtEnd = await helper.blogPostsInDb()
        expect(blogPostsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    })    
})

describe('handling of missing data', () => {
    test('if the likes property is missing from the request, it defaults to 0', async () => {
        const newBlogPost = {
            title: 'Best apps to create blog posts',
            author: 'Sarah Merlens',
            url: 'https://blogposts.com/best-apps-blog-posts',
        }
    
        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${initialToken}`)
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
            .set('Authorization', `Bearer ${initialToken}`)
            .send(blogPostNoTitle)
            .expect(400)
    
        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${initialToken}`)
            .send(blogPostNoURL)
            .expect(400)
    })    
})

describe('deleting and updating exisiting posts', () => {
    test('deletion succeeds with status 204 if id is valid', async () => {
        const blogPosts = await helper.blogPostsInDb()
    
        const blogToDelete = blogPosts[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${initialToken}`)
            .expect(204)
    
        const blogsAtEnd = await helper.blogPostsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)
    
        const contents = blogsAtEnd.map(blog => blog.title)
        expect(contents).not.toContain(blogToDelete.title)
    })
    
    test('updating likes of a blog post succeeds', async () => {
        const blogPosts = await helper.blogPostsInDb()
        const blogToUpdate = blogPosts[0]
    
        blogToUpdate.likes += 1
    
        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${initialToken}`)
            .send(blogToUpdate)
            .expect(200)
    
        expect(response.body.likes).toBe(blogToUpdate.likes)
    })
    
})

describe('handling unauthorized requests', () => {
    test('making POST request without authorization fails with status code 401', async () => {
        const newBlogPost = {
            title: 'Writing blog posts is easy',
            author: 'Ferdinand Marques',
            url: 'https://blogposts.com/writing-blog-posts-easy',
            likes: 2
        }
    
        await api
            .post('/api/blogs')
            .send(newBlogPost)
            .expect(401)
    
        const blogPostsAtEnd = await helper.blogPostsInDb()
        expect(blogPostsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
    
    test('deleting a post returns status code 401 if the user is not authorized', async () => {
        const blogPosts = await helper.blogPostsInDb()
        const blogToDelete = blogPosts[0]
    
        const result = await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${secondToken}`)
            .expect(401)
    
        expect(result.body.error).toBe('user not authorized')
    
        const blogsAtEnd = await helper.blogPostsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    
        const contents = blogsAtEnd.map(blog => blog.title)
        expect(contents).toContain(blogToDelete.title)
    })
    
    test('updating a post returns status code 401 if the user is not authorized', async () => {
        const blogPosts = await helper.blogPostsInDb()
        const blogToUpdate = blogPosts[0]
    
        blogToUpdate.likes += 1
    
        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${secondToken}`)
            .send(blogToUpdate)
            .expect(401)
    
        expect(response.body.error).toBe('user not authorized')
    })
    
})

afterAll(async () => {
    await mongoose.connection.close()
})