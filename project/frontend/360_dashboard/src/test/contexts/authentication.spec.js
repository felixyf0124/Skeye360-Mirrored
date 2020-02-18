import { expect } from 'chai';
import reducer, {
  initState,
  logout,
  authSuccess,
  authFail,
  authenticated,
  isStaff,
} from '../../contexts/authentication';

// AUTHENTICATION TEST
describe('authentication redux', () => {
  describe('selector', () => {
    const loggedOutState = {
      authentication: {
        sessionToken: '',
        username: '',
        timestamp: '',
        error: '',
        user_id: 0,
        is_staff: false,
      },
    };

    const operatorState = {
      authentication: {
        sessionToken: 'operator-1',
        username: 'operator',
        timestamp: '123',
        error: '',
        user_id: 2,
        is_staff: false,
      },
    };

    const adminState = {
      authentication: {
        sessionToken: 'admin-1',
        username: 'admin',
        timestamp: '123',
        error: '',
        user_id: 1,
        is_staff: true,
      },
    };
    // Authenticated Selector
    it('check if a user is authenticated', () => {
      expect(authenticated(operatorState)).to.equal(true);
    });

    it('check if a user is not authenticated', () => {
      expect(authenticated(loggedOutState)).to.equal(false);
    });

    // isStaff selector
    it('check if a user is a staff', () => {
      expect(isStaff(adminState)).to.equal(true);
    });

    it('check if a user is not a staff', () => {
      expect(isStaff(operatorState)).to.equal(false);
    });
  });
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
          is_staff: false,
        }),
      );
      expect(result).to.include({
        sessionToken: '',
        username: '',
        user_id: 0,
        error: '',
        is_staff: false,
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
        user_id: 0,
        is_staff: false,
      });
    });
  });
});
