import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'my-secret-key';

  mongo = new MongoMemoryServer();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let col of collections) {
    await col.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
