/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';

import reducer, {
  initState,
  getDistrictsSuccess,
  GetDistrictsSuccessAction,
  getDistrictsFail,
  GetDistrictsFailAction,
  resetDistricts,
} from '../../contexts/districts';

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

// initState
const initState = {
  Montreal: {
    id: 1,
    district_name: 'Loading...',
    intersections: [
      {
        id: 1,
        intersection_name: 'Loading...',
        latitude: 123,
        cameras: [
          {
            id: 1,
            camera_url: '0.0.0.0:8001',
            intersection_id: 1,
          },
        ],
        longitude: 456,
        district_id: 1,
      },
    ],
  },
};

// mock data
const data = {
  0: {
    id: 1,
    district_name: 'Montreal',
    intersections: [
      {
        id: 1,
        intersection_name: 'Guy/St-Catherine',
        latitude: 12.345,
        cameras: [
          {
            id: 1,
            camera_url: '0.0.0.0:8001',
            intersection_id: 1,
          },
        ],
        longitude: -54.321,
        district_id: 1,
      },
    ],
  },
};

describe('district redux', () => {
  describe('reducer', () => {
    // RESET
    it('should reset district state', () => {
      const result = reducer(initState, resetDistricts());
      expect(result).to.containSubset({
        0: {
          id: 0,
          district_name: 'Loading...',
          intersections: [
            {
              id: 0,
              intersection_name: 'Loading...',
              latitude: 123,
              cameras: [
                {
                  id: 0,
                  camera_url: '0.0.0.0:8001',
                  intersection_id: 1,
                },
              ],
              longitude: 456,
              district_id: 0,
              user_id: 0,
            },
          ],
        },
      });
    });
    // SUCCESS
    // READ
    it('should get district successfully', () => {
      const result = reducer(initState, getDistrictsSuccess(data));
      expect(result).to.containSubset({
        Montreal: {
          id: 1,
          district_name: 'Montreal',
          intersections: [
            {
              id: 1,
              intersection_name: 'Guy/St-Catherine',
              latitude: 12.345,
              cameras: [
                {
                  id: 1,
                  camera_url: '0.0.0.0:8001',
                  intersection_id: 1,
                },
              ],
              longitude: -54.321,
              district_id: 1,
            },
          ],
        },
      });
    });
    // FAIL
    // READ
    it('should fail to get districts', () => {
      const result = reducer(initState, getDistrictsFail());
      expect(result).to.containSubset({
        Montreal: {
          id: 1,
          district_name: 'Loading...',
          intersections: [
            {
              id: 1,
              intersection_name: 'Loading...',
              latitude: 123,
              cameras: [
                {
                  id: 1,
                  camera_url: '0.0.0.0:8001',
                  intersection_id: 1,
                },
              ],
              longitude: 456,
              district_id: 1,
            },
          ],
        },
      });
    });
  });
});
