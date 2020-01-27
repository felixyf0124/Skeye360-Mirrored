import { expect } from 'chai';
import reducer, { initState, getCountSuccess, getCountFail } from '../../contexts/vehicleCounts';

const data = {
  los: 30,
  error: '',
  success: true,
};

// VEHICLE COUNT TEST
describe('vehicleCount redux', () => {
  describe('reducer', () => {
    // get vehicleCount Success
    it('get the vehicleCount successfully', () => {
      const result = reducer(initState, getCountSuccess(data));
      expect(result).to.include({
        los: 30,
        error: '',
        success: true,
      });
    });
    // get vehicleCount Fail
    it('get vehicleCount fail', () => {
      const result = reducer(initState, getCountFail());
      expect(result).to.include({
        los: -1,
        error: 'Error while getting existing count.',
        success: false,
      });
    });
  });
});
