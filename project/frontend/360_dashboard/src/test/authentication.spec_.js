import { expect } from 'chai';

import reducer, {
  initState,
  authenticate,
  // logout,
  // authSuccess,
  // authFail,
  // handleAuthentication,
} from '../contexts/authentication';

describe('authentication redux', () => {
  describe('reducer', () => {
    it('should init application success correctly', () => {
      const result = reducer(
        initState,
        authenticate({ username: 'TEST', password: 'TEST' }),
      );
      expect(result).to.include({
        username: 'TEST',
        authenticated: true,
      });
    });
  });
});
