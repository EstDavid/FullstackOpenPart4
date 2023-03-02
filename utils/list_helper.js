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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}