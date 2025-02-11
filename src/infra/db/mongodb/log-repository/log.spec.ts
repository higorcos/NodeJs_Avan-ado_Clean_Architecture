import { MongoHelper } from '../helpers/monge-helper';
import { Collection } from 'mongodb';
import { LogMongoRepository } from './log';

describe('LOog Mongo Repository', () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  test('Deve criar um log de erro em caso de sucesso', async () => {
    const sut = new LogMongoRepository();
    await sut.logError('any_error');
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});
