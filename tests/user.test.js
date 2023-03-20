const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
    await User.deleteMany({})
})

describe('user creation with correct data', () => {
    test('a user can be created', async () => {
        await api
            .post('/api/users')
            .send(helper.usersList.initialUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(1)

        const createdUser = usersAtEnd[0]
        expect(createdUser.username).toEqual(helper.usersList.initialUser.username)
    })
})

describe('user creation with incorrect data', () => {
    test('user creation without username is rejected', async () => {
        const result = await api
            .post('/api/users')
            .send(helper.usersList.noUsernameUser)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username missing')
    })

    test('user creation without password is rejected', async () => {
        const result = await api
            .post('/api/users')
            .send(helper.usersList.noPasswordUser)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password missing')
    })

    test('username with less than 3 characters is rejected', async () => {
        const result = await api
            .post('/api/users')
            .send(helper.usersList.incorrectNameUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain(
            'Path `username` (`' +
            helper.usersList.incorrectNameUser.username +
            '`) is shorter than the minimum allowed length (3).'
        )

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(0)
    })

    test('password with less than 3 characters is rejected', async () => {
        const result = await api
            .post('/api/users')
            .send(helper.usersList.incorrectPasswordUser)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('password must be at least 3 characters long')
    })

    test('username creation is rejected if it already exists in the database', async () => {
        await api
            .post('/api/users')
            .send(helper.usersList.initialUser)
            .expect('Content-Type', /application\/json/)

        const result = await api
            .post('/api/users')
            .send(helper.usersList.initialUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(1)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})