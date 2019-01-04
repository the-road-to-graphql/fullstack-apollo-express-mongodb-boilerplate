import mongoose from 'mongoose';

import User from './user';
import Message from './message';

const connectDb = () => {
  if (process.env.DATABASE_URL) {
    return mongoose.connect(process.env.DATABASE_URL);
  }

  if (process.env.TEST_DATABASE_URL) {
    return mongoose.connect(process.env.TEST_DATABASE_URL);
  }
};

const models = { User, Message };

export { connectDb };

export default models;
