import { expect } from 'chai';

import * as api from './api';
import { getUsers } from '../testUtils/userTestUtils';
import { connectDb } from '../models';
let mongooseInstance;
let token;
before(async () => {
  mongooseInstance = await connectDb(
    'mongodb://localhost:27017/mytestdatabase',
  );
  users = await getUsers();
  const { data } = await api.signIn({
    login: 'rwieruch',
    password: 'rwieruch',
  });
  token = data.data.signIn.token;
});
after(async () => {
  await mongooseInstance.connection.close();
});

describe('Messages', () => {
  describe('messages (limit: INT)', () => {
    it('should get messages', async () => {
      const { data } = await api.messages(undefined, token);
      expect(data).to.eql({
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
      });
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
      }
      const { data } = await api.messagesInclUsers(undefined, token);
      expect(data).to.eql(expectedResult);
    });
  });
});
