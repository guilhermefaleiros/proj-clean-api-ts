import request from 'supertest'
import app from '../config/app'

describe('Body Parser middleware', () => {
  test('Sould parse body as JSON ', async () => {
    app.post('/test_body_parser', (req, res) => {
      return res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Guilherme' })
      .expect({ name: 'Guilherme' })
  })
})
