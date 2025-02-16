import { Collection, MongoClient } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect(url: string): Promise<void> {
    this.url = url;
    this.client = await MongoClient.connect(url, {
      /*  useNewUrlParser: true, */
      /* useUnifiedTopology: true, */
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    /*  if (!this.client?.isConnected()) {
    } */
    await this.client.connect(this.url);
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
