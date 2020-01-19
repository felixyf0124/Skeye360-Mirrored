/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';

import reducer, {
  initState,
  addCameraSuccess,
  addCameraFail,
  getCameraSuccess,
  editCameraSuccess,
  editCameraFail,
  deleteCameraSuccess,
  deleteCameraFail,
  getCameraFail,
  resetCamera,
} from '../../contexts/camera';

const data = {
  id: 1,
  camera_url: '111.222.333.444:5555',
  intersection_id: 1,
};

const dataState = {
  id: 1,
  camera_url: '111.222.333.444:5555',
  intersection_id: 1,
  error: '',
  success: true,
};

describe('camera redux', () => {
  describe('reducer', () => {
    // RESET
    it('should reset camera state', () => {
      const result = reducer(initState, resetCamera());
      expect(result).to.include({
        id: 0,
        camera_url: '',
        intersection_id: 0,
        error: '',
        success: false,
      });
    });
    // SUCCESS
    // CREATE
    it('should add new camera successfully', () => {
      const result = reducer(initState, addCameraSuccess(dataState));
      expect(result).to.include({
        id: 0,
        camera_url: '',
        intersection_id: 0,
        error: 'New camera created.',
        success: true,
      });
    });
    // READ
    it('should get camera successfully', () => {
      const result = reducer(dataState, getCameraSuccess(data));
      expect(result).to.include({
        id: 1,
        camera_url: '111.222.333.444:5555',
        intersection_id: 1,
        error: '',
        success: true,
      });
    });
    // UPDATE
    it('should edit intersection successfully', () => {
      const result = reducer(dataState, editCameraSuccess(data));
      expect(result).to.include({
        id: 1,
        camera_url: '111.222.333.444:5555',
        intersection_id: 1,
        error: 'Camera updated.',
        success: true,
      });
    });
    // DELETE
    it('should delete intersection successfully', () => {
      const result = reducer(initState, deleteCameraSuccess('0'));
      expect(result).to.include({
        id: 0,
        camera_url: '',
        intersection_id: 0,
        error: 'Camera deleted.',
        success: true,
      });
    });
    // FAIL
    // CREATE
    it('should fail to add intersection', () => {
      const result = reducer(initState, addCameraFail());
      expect(result).to.include({
        id: 0,
        camera_url: '',
        intersection_id: 0,
        error: 'Error while adding new camera.',
        success: false,
      });
    });
    // READ
    it('should fail to get intersection', () => {
      const result = reducer(initState, getCameraFail());
      expect(result).to.include({
        id: 0,
        camera_url: '',
        intersection_id: 0,
        error: 'Error while getting existing camera.',
        success: false,
      });
    });
    // UPDATE
    it('should fail to edit intersection', () => {
      const result = reducer(initState, editCameraFail());
      expect(result).to.include({
        id: 0,
        camera_url: '',
        intersection_id: 0,
        error: 'Error while editing existing camera.',
        success: false,
      });
    });
    // DELETE
    it('should fail to delete intersection', () => {
      const result = reducer(initState, deleteCameraFail());
      expect(result).to.include({
        id: 0,
        camera_url: '',
        intersection_id: 0,
        error: 'Error while deleting existing camera.',
        success: false,
      });
    });
  });
});
