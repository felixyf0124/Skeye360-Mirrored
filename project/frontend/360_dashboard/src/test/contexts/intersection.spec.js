/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';

import reducer, {
  initState,
  addIntersectionSuccess,
  addIntersectionFail,
  getIntersectionSuccess,
  editIntersectionSuccess,
  editIntersectionFail,
  deleteIntersectionSuccess,
  deleteIntersectionFail,
  getIntersectionFail,
  resetIntersection,
} from '../../contexts/intersection';

const data = {
  id: 1,
  intersection_name: 'Concordia',
  latitude: '123',
  cameras: [],
  longitude: '321',
  district_id: '1',
  user_id: 0,
};

describe('intersection redux', () => {
  describe('reducer', () => {
    // RESET
    it('should reset intersection state', () => {
      const result = reducer(initState, resetIntersection());
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        error: '',
        success: false,
      });
    });
    // SUCCESS
    // CREATE
    it('should add new intersection successfully', () => {
      const result = reducer(initState, addIntersectionSuccess(data));
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        user_id: 0,
        error: 'New intersection created.',
        success: true,
      });
    });
    // READ
    it('should get intersection successfully', () => {
      const result = reducer(initState, getIntersectionSuccess(data));
      expect(result).to.include({
        intersection_id: '1',
        latitude: '123',
        longitude: '321',
        intersection_name: 'Concordia',
        district_id: '1',
        user_id: 0,
        error: '',
        success: true,
      });
    });
    // UPDATE
    it('should edit intersection successfully', () => {
      const result = reducer(initState, editIntersectionSuccess(data));
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        user_id: 0,
        error: 'Intersection updated.',
        success: true,
      });
    });
    // DELETE
    it('should delete intersection successfully', () => {
      const result = reducer(initState, deleteIntersectionSuccess('1'));
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        user_id: 0,
        error: 'Intersection deleted.',
        success: true,
      });
    });
    // FAIL
    // CREATE
    it('should fail to add intersection', () => {
      const result = reducer(initState, addIntersectionFail());
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        user_id: 0,
        error: 'Error while adding new intersection.',
        success: false,
      });
    });
    // READ
    it('should fail to get intersection', () => {
      const result = reducer(initState, getIntersectionFail());
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        user_id: 0,
        error: 'Error while getting existing intersection.',
        success: false,
      });
    });
    // UPDATE
    it('should fail to edit intersection', () => {
      const result = reducer(initState, editIntersectionFail());
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        user_id: 0,
        error: 'Error while editing existing intersection.',
        success: false,
      });
    });
    // DELETE
    it('should fail to delete intersection', () => {
      const result = reducer(initState, deleteIntersectionFail());
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        user_id: 0,
        error: 'Error while deleting existing intersection.',
        success: false,
      });
    });
  });
});
