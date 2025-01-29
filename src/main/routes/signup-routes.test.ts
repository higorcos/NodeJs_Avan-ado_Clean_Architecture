import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/monge-helper';

describe('Signup', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });
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
