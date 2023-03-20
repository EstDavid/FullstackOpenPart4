const { totalLikes, favoriteBlog, mostBlogs, mostLikes, dummy } = require('../utils/list_helper')
const { initialBlogs } = require('./test_helper')

const blogList = initialBlogs

test('dummy returns 1', () => {
    const result = dummy(blogList)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = totalLikes([])
        expect(result).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = totalLikes([blogList[0]])
        expect(result).toBe(blogList[0].likes)
    })

    test('of a bigger list is calculated right', () => {
        const result = totalLikes(blogList)
        expect(result).toBe(80)
    })
})

describe('favorite blog', () => {
    test('of empty list returns object with undefined values', () => {
        const result = favoriteBlog([])
        expect(result).toEqual({
            title: undefined,
            author: undefined,
            likes: undefined
        })
    })

    test('when list has only one blog it returns its properties', () => {
        const result = favoriteBlog([blogList[0]])
        const { title, author, likes } = blogList[0]
        expect(result).toEqual({
            title,
            author,
            likes
        })
    })

    test('of a bigger list is calculated right', () => {
        const result = favoriteBlog(blogList)

        expect(result).toEqual({
            title: 'How to fetch a blog post',
            author: 'Jeremy Loggins',
            likes: 55
        })
    })
})

describe('most blogs', () => {
    test('of empty list returns object with undefined values', () => {
        const result = mostBlogs([])
        expect(result).toEqual({
            author: undefined,
            blogs: undefined
        })
    })

    test('when list has only one blog it returns object with author name and 1 blog', () => {
        const result = mostBlogs([blogList[0]])
        const { author } = blogList[0]
        expect(result).toEqual({
            author,
            blogs: 1
        })
    })

    test('of a bigger list is calculated right', () => {
        const result = mostBlogs(blogList)

        expect(result).toEqual({
            author: 'Cindy Crawlings',
            blogs: 2
        })
    })
})

describe('most likes', () => {
    test('of empty list returns object with undefined values', () => {
        const result = mostLikes([])
        expect(result).toEqual({
            author: undefined,
            likes: undefined
        })
    })

    test('when list has only one blog it returns object with author name and likes', () => {
        const result = mostLikes([blogList[0]])
        const { author, likes } = blogList[0]
        expect(result).toEqual({
            author,
            likes
        })
    })

    test('of a bigger list is calculated right', () => {
        const result = mostLikes(blogList)

        expect(result).toEqual({
            author: 'Jeremy Loggins',
            likes: 55
        })
    })
})