import mongoose from 'mongoose';

import UserModel from './user';
import MessageModel from './message';

export function connectDb() {
  if (process.env.DATABASE_URL) {
    return mongoose.connect(process.env.DATABASE_URL);
  }

  if (process.env.TEST_DATABASE_URL) {
    return mongoose.connect(process.env.TEST_DATABASE_URL);
  }
}

export default {
  User: UserModel,
  Message: MessageModel,
};
