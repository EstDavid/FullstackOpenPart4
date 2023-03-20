const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let favoriteBlog = {}
    let mostLikes = 0

    blogs.forEach(blog => {
        if (blog.likes > mostLikes) {
            mostLikes = blog.likes
            favoriteBlog = blog
        }
    })

    const { title, author, likes } = favoriteBlog

    return {
        title,
        author,
        likes
    }
}

const mostBlogs = (blogs) => {
    const mostBlogsAuthor = _(blogs)
        .countBy('author')
        .entries()
        .maxBy((author) => author[1])

    if (mostBlogsAuthor === undefined) {
        return {
            author: undefined,
            blogs: undefined
        }
    }

    const [author, blogsNumber] = mostBlogsAuthor
    return {
        author,
        blogs: blogsNumber
    }
}

const mostLikes = (blogs) => {
    const mostLikesAuthor = _(blogs)
        .groupBy('author')
        .map((blogsArray, author) => {
            const likes = _.sumBy(blogs, (blog) => {
                if (blog.author === author) {
                    return blog.likes
                } else {
                    return 0
                }
            })

            return [author, likes]
        })
        .maxBy(author => author[1])

    if (mostLikesAuthor === undefined) {
        return {
            author: undefined,
            likes: undefined
        }
    }
    const [author, likesNumber] = mostLikesAuthor

    return {
        author,
        likes: likesNumber
    }
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}