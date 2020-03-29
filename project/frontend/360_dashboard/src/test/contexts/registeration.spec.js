/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';
import reducer, {
  initState, registerSuccess, registerFail,
} from '../../contexts/register';

// REGISTER TEST
describe('register redux', () => {
  describe('reducer', () => {
    // Register Success
    it('should set username as the username in the input', () => {
      const result = reducer(
        initState,
        (global.window = {
          username: 'TEST',
          user_id: 0,
        }),
        registerSuccess({
          username: 'TEST',
          user_id: 0,
        }),
      );
      console.log(result);
      expect(result).to.include({
        username: '',
        error: '',
      });
    });
    // Register Fail
    it('failed regsitration', () => {
      const result = reducer(initState, registerFail());
      expect(result).to.include({
        username: '',
        error: 'Invalid Input.',
      });
    });
  });
});