import mongoose from 'mongoose';

import User from './user';
import Message from './message';
/**
 * @param {string} [dbUrl]
 */
const connectDb = dbUrl => {
  if (dbUrl) {
    return mongoose.connect(
      dbUrl,
      { useNewUrlParser: true },
    );
  }
  // order here is important
  if (process.env.TEST_DATABASE_URL) {
    return mongoose.connect(
      process.env.TEST_DATABASE_URL,
      { useNewUrlParser: true },
    );
  }
  if (process.env.DATABASE_URL) {
    return mongoose.connect(
      process.env.DATABASE_URL,
      { useNewUrlParser: true },
    );
  }
};

const models = { User, Message };

export { connectDb };

export default models;
