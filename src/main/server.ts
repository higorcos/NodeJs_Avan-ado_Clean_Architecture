import { MongoHelper } from '../infra/db/mongodb/helpers/monge-helper';
import env from './config/env';

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.port, () =>
      console.log(`Server Running at port: ${env.port}`)
    );
  })
  .catch(console.error);
