const express = require('express')
const blogsRouter = express.Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

blogsRouter.delete('/:id', (request, response, next) => {
    Blog.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

blogsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const { title, author, url, likes } = body

    const blog = {
        title,
        author,
        url,
        likes
    }

    Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        .then(updatedBlog => {
            response.json(updatedBlog)
        })
        .catch(error => next(error))
})

module.exports = blogsRouter