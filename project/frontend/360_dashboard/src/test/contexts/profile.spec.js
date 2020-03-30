  
import { expect } from 'chai';
import reducer, {
  initState, profile
} from '../../contexts/profile';

// PROFILE TEST
describe('profile redux', () => {
  describe('reducer', () => {
    // Get profile Success
    it('Getting profile successfully', () => {
      const result = reducer(
        initState,
        (global.window = {
            id: '0',
            email: '',
            is_staff: false,
            username: '',
            error: '',
            success: false,
        }),
        profile({
            id: '0',
            email: '',
            is_staff: false,
            username: '',
            error: '',
            success: false,
        }),
      );
      console.log(result);
      expect(result).to.include({
        id: '0',
        email: '',
        is_staff: false,
        username: '',
        error: '',
        success: false,
      });
    });
    // Get profile Failed
    it('Failed getting profile', () => {
      const result = reducer(initState, profile());
      expect(result).to.include({
        id: "0",
        error : '',
        email: '',
        is_staff: false,
        username: '',
        success: false,
      });
    });
  });
});