/* eslint-disable @typescript-eslint/no-unused-vars */
import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.MONGO_URL, {
      /*  useNewUrlParser: true, */
      /* useUnifiedTopology: true, */
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  },

  getCollection(name: string): Collection {
    return this.client.db().collection(name);
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  map: (collection: any): any => {
    const result = Object.assign({}, collection, {
      id: collection['_id'].toString()
    });
    delete result['_id'];
    return result;
  }
};
