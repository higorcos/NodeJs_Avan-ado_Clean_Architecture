import request from 'supertest';
import app from '../config/app';

describe('Signup', () => {
  test('Should return an account on sucesso', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Higor',
        email: 'phc@gmail.com',
        password: '23452345',
        passwordConfirmation: '23452345'
      })
      .expect(200);
  });
});
