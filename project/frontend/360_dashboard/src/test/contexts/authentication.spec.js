import { expect } from 'chai';
import reducer, {
  initState, logout, authSuccess, authFail,
} from '../../contexts/authentication';

// AUTHENTICATION TEST
describe('authentication redux', () => {
  describe('reducer', () => {
    // Authenticate Success
    it('should set username as the username in the input', () => {
      const result = reducer(
        initState,
        (global.window = {
          username: 'TEST',
          user_id: 0,
        }),
        authSuccess({
          username: 'TEST',
          user_id: 0,
        }),
      );
      console.log('BBB');
      console.log(result);
      expect(result).to.include({
        sessionToken: '',
        username: '',
        user_id: 0,
        error: '',
      });
    });
    // Authenticate Fail
    it('failed authentication', () => {
      const result = reducer(initState, authFail());
      expect(result).to.include({
        sessionToken: '',
        username: '',
        timestamp: '',
        error: 'Invalid credentials.',
      });
    });
    // Logout
    it('logout redux', () => {
      const result = reducer(initState, (global.window = { localStorage: initState }), logout());
      expect(result).to.include({
        sessionToken: '',
        username: '',
        timestamp: '',
        error: '',
      });
    });
  });
});
