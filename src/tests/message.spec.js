import { expect } from 'chai';

import * as api from './api';
import models, { connectDb } from '../models';

let db;

before(async () => {
  db = await connectDb('mongodb://localhost:27017/mytestdatabase');
});

after(async () => {
  await db.connection.close();
});

describe('Messages', () => {
  describe('messages (limit: INT)', () => {
    it('returns a list of messages', async () => {
      const expectedResult = {
        data: {
          messages: {
            edges: [
              {
                text: 'Published a complete ...',
              },
              {
                text: 'Happy to release ...',
              },
            ],
          },
        },
      };

      const result = await api.messages();

      expect(result.data).to.eql(expectedResult);
    });

    it('should get messages with the users', async () => {
      const expectedResult = {
        data: {
          messages: {
            edges: [
              {
                text: 'Published a complete ...',
                user: {
                  username: 'ddavids',
                },
              },
              {
                text: 'Happy to release ...',
                user: {
                  username: 'ddavids',
                },
              },
            ],
          },
        },
      };

      const result = await api.messagesInclUsers();

      expect(result.data).to.eql(expectedResult);
    });
  });
});
