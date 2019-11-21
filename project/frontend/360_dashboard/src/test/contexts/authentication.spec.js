import { expect } from 'chai';
import reducer, {
  initState,
  logout,
  authSuccess,
  authFail,
} from '../../contexts/authentication';

// AUTHENTICATION TEST
describe('authentication redux', () => {
  describe('reducer', () => {
    // Authenticate Success
    it('should set username as the username in the input and authenticated to true', () => {
      const result = reducer(
        initState,
        authSuccess({ username: 'TEST', user_id: '1' }),
      );
      expect(result).to.include({
        username: 'TEST',
        user_id: '1',
      });
    });
    // Authenticate Fail
    it('failed authentication', () => {
      const result = reducer(
        initState,
        authFail(),
      );
      expect(result).to.include({
        sessionToken: '',
        username: '',
        timestamp: '',
        error: 'Invalid credentials.',
      });
    });
    // Logout
    it('logout redux', () => {
      const result = reducer(
        initState,
        global.window = { localStorage: initState },
        logout(),
      );
      expect(result).to.include({
        sessionToken: '',
        username: '',
        timestamp: '',
        error: '',
      });
    });
  });
});
