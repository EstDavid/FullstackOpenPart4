const express = require('express')
const blogsRouter = express.Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const blog = new Blog({
        ...body,
        user: request.user.id
    })

    if (blog.likes === undefined) {
        blog.likes = 0
    }

    if (blog.title === undefined || blog.url === undefined) {
        response.status(400).end()
    } else {
        const savedBlog = await blog.save()
        response.status(201).json(savedBlog)
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== request.user.id.toString()) {
        return response.status(401).json({ error: 'user not authorized' })
    }

    await blog.remove()
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() !== request.user.id.toString()) {
        return response.status(401).json({ error: 'user not authorized' })
    }
    const body = request.body

    const { title, author, url, likes } = body

    const blogToUpdate = {
        title,
        author,
        url,
        likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogToUpdate, { new: true })
    response.json(updatedBlog)
})

module.exports = blogsRouter