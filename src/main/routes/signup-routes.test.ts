import request from 'supertest'
import app from '../config/app'

describe('SignUp routes', () => {
  test('Should return account on success', async () => {
    app.get('/test_cors', (req, res) => {
      return res.send()
    })
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Guilherme',
        email: 'guilhermefaleiros2000@gmail.com',
        password: 'gui2000',
        passwordConfirmation: 'gui2000'
      })
      .expect(200)
  })
})
