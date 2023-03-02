const { dummy, totalLikes, favoriteBlog } = require('../utils/list_helper')

const blogList = [
    {
        'title': 'How to write a blog post',
        'author': 'Jimmy Fletcher',
        'url': 'https://blogposts.com/write-blog-post',
        'likes': 5,
        'id': '63fe4937fac303dedac54b18'
    },
    {
        'title': 'How to fetch a blog post',
        'author': 'Jeremy Loggins',
        'url': 'https://blogposts.com/fetch-blog-post',
        'likes': 55,
        'id': '63ff0402f9a64d43e3e0d52f'
    },
    {
        'title': 'How to have breakfast',
        'author': 'Cindy Crawlings',
        'url': 'https://blogposts.com/breakfast',
        'likes': 10,
        'id': '63ff0b871f089601a03ae716'
    }
]

describe('basic tests', () => {
    test('dummy returns one', () => {
        const blogs = []
        const result = dummy(blogs)
        expect(result).toBe(1)
    })

    test('total likes', () => {
        const result = totalLikes(blogList)
        expect(result).toBe(70)
    })
})

describe('favorites', () => {
    test('favorite blog', () => {
        const result = favoriteBlog(blogList)

        expect(result).toEqual({
            title: 'How to fetch a blog post',
            author: 'Jeremy Loggins',
            likes: 55
        })
    })
})