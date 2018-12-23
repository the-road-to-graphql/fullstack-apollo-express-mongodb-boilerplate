import mongoose from 'mongoose';

import UserModel from './user';
import MessageModel from './message';

export function connectDb() {
  if (process.env.DATABASE_URL) {
    return mongoose.connect(process.env.DATABASE_URL);
  }
  if (process.env.TEST_DATABASE) {
    return mongoose.connect(
      `mongodb://localhost:27017/${process.env.TEST_DATABASE}`,
    );
  }

  return mongoose.connect(process.env.MONGO_URI);
}

export default {
  User: UserModel,
  Message: MessageModel,
};
