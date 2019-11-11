/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';

import reducer, {
  initState,
  addNewIntersection,
  addIntersectionSuccess,
  addIntersectionFail,
  getExistingIntersection,
  getIntersectionSuccess,
  GetIntersectionFail,
  editExistingIntersection,
  editIntersectionSuccess,
  editIntersectionFail,
  deleteExistingIntersection,
  deleteIntersectionSuccess,
  deleteIntersectionFail,
  handleAddIntersection,
  handleGetIntersection,
  handleEditIntersection,
  handleDeleteIntersection,
  AddIntersectionAction,
  getIntersectionFail,
} from '../../contexts/intersection';

const data = {
  id: 1,
  intersection_name: 'Concordia',
  latitude: '123',
  cameras: [],
  longitude: '321',
  district_id: '1',
};

describe('intersection redux', () => {
  describe('reducer', () => {
    // SUCCESS
    it('should add new intersection successfully', () => {
      const result = reducer(
        initState,
        addIntersectionSuccess(data),
      );
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        error: 'New intersection created.',
        success: true,
      });
    });
    it('should get intersection successfully', () => {
      const result = reducer(
        initState,
        getIntersectionSuccess(data),
      );
      expect(result).to.include({
        intersection_id: '1',
        latitude: '123',
        longitude: '321',
        intersection_name: 'Concordia',
        district_id: '1',
        error: '',
        success: true,
      });
    });
    it('should edit intersection successfully', () => {
      const result = reducer(
        initState,
        editIntersectionSuccess(data),
      );
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        error: 'Intersection updated.',
        success: true,
      });
    });
    it('should delete intersection successfully', () => {
      const result = reducer(
        initState,
        deleteIntersectionSuccess('1'),
      );
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        error: 'Intersection deleted.',
        success: true,
      });
    });
    // FAIL
    it('should fail to add intersection', () => {
      const result = reducer(
        initState,
        addIntersectionFail(),
      );
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        error: 'Error while adding new intersection.',
        success: false,
      });
    });
    it('should fail to get intersection', () => {
      const result = reducer(
        initState,
        getIntersectionFail(),
      );
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        error: 'Error while getting existing intersection.',
        success: false,
      });
    });
    it('should fail to edit intersection', () => {
      const result = reducer(
        initState,
        editIntersectionFail(),
      );
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        error: 'Error while editing existing intersection.',
        success: false,
      });
    });
    it('should fail to delete intersection', () => {
      const result = reducer(
        initState,
        deleteIntersectionFail(),
      );
      expect(result).to.include({
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        error: 'Error while deleting existing intersection.',
        success: false,
      });
    });
  });
});
