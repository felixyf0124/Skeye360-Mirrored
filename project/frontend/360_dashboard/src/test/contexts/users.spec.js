/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';

import reducer, { initState, getUsersSuccess, getUsersFail } from '../../contexts/users';

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

// initState
const initState = {
  0: [{ id: 1, username: 'user', is_staff: false }],
};

// mock data
const data = {
  0: [
    { id: 1, username: 'admin', is_staff: true },
    { id: 2, username: 'operator', is_staff: false },
  ],
};

describe('users redux', () => {
  describe('reducer', () => {
    // SUCCESS
    // READ
    it('should get users successfully', () => {
      const result = reducer(initState, getUsersSuccess(data));
      expect(result).to.containSubset({
        0: [
          { id: 1, username: 'admin', is_staff: true },
          { id: 2, username: 'operator', is_staff: false },
        ],
      });
    });
    // FAIL
    // READ
    it('should fail to get districts', () => {
      const result = reducer(initState, getUsersFail());
      expect(result).to.containSubset({
        0: [{ id: 1, username: 'user', is_staff: false }],
      });
    });
  });
});
