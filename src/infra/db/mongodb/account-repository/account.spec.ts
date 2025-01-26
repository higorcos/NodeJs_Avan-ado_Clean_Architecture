import { MongoHelper } from '../helpers/monge-helper';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Sucesso, tá retornando um account', async () => {
    const sut = new AccountMongoRepository();
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_email');
    expect(account.password).toBe('any_password');
  });
});
