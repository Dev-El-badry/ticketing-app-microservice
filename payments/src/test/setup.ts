import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signin: (userId?: string) => string[];
}

jest.mock('../nats-wrapper');
process.env.STRIPE_KEY = 'sk_test_51JSXGgKsKJOAN1GHoyHFnXOLiPKPXqFC9oaPQijSvV68Siyhul1EyWaHze0mlVwUYP700UJHH8OfY8ObLfqmUcbR0041DtDgXz';

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'my-secret-key';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = (userId?:string) => {
  const credentials = {
    id: userId || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  const token = jwt.sign(credentials, process.env.JWT_KEY!);
  const session = {jwt: token};
  const base64 = Buffer.from(JSON.stringify(session)).toString('base64');
  return [`express:sess=${base64}`];
};