import { expect } from 'chai';

import reducer, {
  initState,
  authenticate,
  logout,
  authSuccess,
  authFail,
  // handleAuthentication,
} from '../../contexts/authentication';

describe('authentication redux', () => {
  describe('reducer', () => {
    it('should set username as the username in the input and authenticated to true', () => {
      const result = reducer(
        initState,
        authSuccess({ username: 'TEST', user_id: '1' }),
      );
      expect(result).to.include({
        username: 'TEST',
        user_id: '1',
        authenticated: true,
      });
    });
    it('failed authentication', () => {
      const result = reducer(
        initState,
        authFail(),
      );
      expect(result).to.include({
        sessionToken: '',
        username: '',
        timestamp: '',
        authenticated: false,
        error: 'Invalid credentials.',
      });
    });
    it('logout redux', () => {
      const result = reducer(
        initState,
        logout(),
      );
      expect(result).to.include({
        sessionToken: '',
        username: '',
        timestamp: '',
        authenticated: false,
        error: '',
      });
    });
  });
});
