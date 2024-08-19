const request = require('supertest')
const app = require('../../src/server') // Import your Express app
const { User } = require('../../src/db/models')
const { newUser } = require('../../src/controllers/users')

describe('User Controller', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await User.destroy({ where: {} })
  })

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUserDetails = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'HASHED'
      }

      const response = await request(app).post('/users').send(newUserDetails)

      expect(response.status).toBe(201)
      expect(response.body.firstname).toEqual(newUserDetails.firstname)
      expect(response.body.lastname).toEqual(newUserDetails.lastname)
      expect(response.body.email).toEqual(newUserDetails.email)

      // Check that the user was inserted into the database
      const userInDb = await User.findByPk(response.body.id)
      expect(userInDb).not.toBeNull()
      expect(userInDb.firstname).toEqual(newUserDetails.firstname)
    })
  })

  describe('GET /users/check-email', () => {
    it('should validate that the email is unique', async () => {
      // Insert a user into the database
      const existingUser = await User.create({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane.doe@example.com',
        hashed_password: 'HASHED'
      })

      const response = await request(app).get('/users/check-email').query({ email: 'jane.doe@example.com' })

      expect(response.status).toBe(200)
      expect(response.body.isUnique).toBe(true)
    })

    it('should validate that the email is not unique', async () => {
      const response = await request(app).get('/users/check-email').query({ email: 'non.existent@example.com' })

      expect(response.status).toBe(200)
      expect(response.body.isUnique).toBe(false)
    })
  })

  describe('POST /users/check-password', () => {
    it('should validate the user password correctly', async () => {
      // Create a user with a known password
      const newUserDetails = {
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        password: 'securepassword' // Ensure the field name matches your database schema
      }

      // Creating a new user. We assume that the first test case pases in this circumstance.
      await request(app).post('/users').send(newUserDetails)

      // Test correct password
      let response = await request(app)
        .post('/users/check-password')
        .send({ email: newUserDetails.email, password: newUserDetails.password })

      expect(response.status).toBe(200)
      expect(response.body.isMatch).toBe(true)

      // Test incorrect password
      response = await request(app)
        .post('/users/check-password')
        .send({ email: newUserDetails.email, password: 'wrongpassword' })

      expect(response.status).toBe(200)
      expect(response.body.isMatch).toBe(false)

      // Test non-existent user
      response = await request(app)
        .post('/users/check-password')
        .send({ email: 'nonexistent@example.com', password: 'any' })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /users/:id', () => {
    it('should delete a specific user', async () => {
      // Insert a user into the database
      const user = await User.create({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        hashed_password: 'HASHED'
      })

      const response = await request(app).delete(`/users/${user.id}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toEqual(`User with ${user.id} ID successfully deleted.`)

      // Check that the user was deleted from the database
      const userInDb = await User.findByPk(user.id)
      expect(userInDb).toBeNull()
    })

    it('should return a 404 if the user does not exist', async () => {
      const response = await request(app).delete('/users/999')

      expect(response.status).toBe(404)
    })
  })
})
