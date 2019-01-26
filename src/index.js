import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import express from 'express';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import models, { connectDb } from './models';
import loaders from './loaders';

const app = express();

app.use(cors());

app.use(morgan('dev'));

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};

const server = new ApolloServer({
  introspection: true,
  typeDefs: schema,
  resolvers,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }

    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const isTest = !!process.env.TEST_DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 8000;

connectDb().then(async () => {
  if (isTest || isProduction) {
    // reset database
    await Promise.all([
      models.User.deleteMany({}),
      models.Message.deleteMany({}),
    ]);

    createUsersWithMessages(new Date());
  }

  httpServer.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
});

const createUsersWithMessages = async date => {
  const user1 = new models.User({
    username: 'rwieruch',
    email: 'hello@robin.com',
    password: 'rwieruch',
    role: 'ADMIN',
  });

  const user2 = new models.User({
    username: 'ddavids',
    email: 'hello@david.com',
    password: 'ddavids',
  });

  const message1 = new models.Message({
    text: 'Published the Road to learn React',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    userId: user1.id,
  });

  const message2 = new models.Message({
    text: 'Happy to release ...',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    userId: user2.id,
  });

  const message3 = new models.Message({
    text: 'Published a complete ...',
    createdAt: date.setSeconds(date.getSeconds() + 1),
    userId: user2.id,
  });

  await message1.save();
  await message2.save();
  await message3.save();

  await user1.save();
  await user2.save();
};
