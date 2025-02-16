import { LogErrorRepository } from '../../../../data/protocols/log-error-repository';
import { MongoHelper } from '../helpers/monge-helper';

export class LogMongoRepository implements LogErrorRepository {
  async logError(stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.insertOne({
      stack,
      date: new Date()
    });
  }
}
