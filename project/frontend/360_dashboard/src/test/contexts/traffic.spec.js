import { expect } from 'chai';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import reducer, {
  initState,
  getTrafficSuccess,
  getTrafficFail,
  resetTraffic,
} from '../../contexts/traffic';

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

// TRAFFIC INTENSITY TEST
describe('traffic redux', () => {
  describe('reducer', () => {
    // get traffic Success
    it('get traffic list successfully', () => {
      const result = reducer(initState, getTrafficSuccess(123, { los: 456 }));
      expect(result).to.containSubset({
        0: { los: 0 },
        123: { los: 456 },
      });
    });
    // get traffic Fail
    it('get traffic list fails', () => {
      const result = reducer(initState, getTrafficFail(123, { los: 456 }));
      expect(result).to.containSubset({
        0: { los: 0 },
        123: { los: -1 },
      });
    });
    // reset traffic
    it('reset traffic list back to the initState', () => {
      const result = reducer(initState, resetTraffic());
      expect(result).to.containSubset({
        0: { los: 0 },
      });
    });
  });
});
