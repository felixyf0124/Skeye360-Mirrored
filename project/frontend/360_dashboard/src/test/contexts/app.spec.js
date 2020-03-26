/* eslint-disable @typescript-eslint/camelcase */
import { expect } from 'chai';

import reducer, { initState, setSelectedDistrict, setDistrictCoord } from '../../contexts/app';

const chai = require('chai');
const chaiSubset = require('chai-subset');

chai.use(chaiSubset);

// initState
const initState = {
  currentDistrict: 'Montreal',
  selectedIntersection: 'none',
  districtLat: 45.5017,
  districtLng: -73.5673,
  defaultLat: 45.5017,
  defaultLng: -73.5673,
  zoom: 11,
};

describe('app redux', () => {
  describe('reducer', () => {
    // Selected District
    it('should select another district. in this case Toronto, 123, 456, 11', () => {
      const result = reducer(initState, setSelectedDistrict('Toronto', 123, 456, 11));
      expect(result).to.containSubset({
        currentDistrict: 'Toronto',
        selectedIntersection: 'none',
        districtLat: 123,
        districtLng: 456,
        defaultLat: 123,
        defaultLng: 456,
        zoom: 11,
      });
    });
    // Set District Coordinates
    it('should select another intersection in district Montreal. in this case Concordia, 111, 222, 15', () => {
      const result = reducer(initState, setDistrictCoord('Concordia', 111, 222, 15));
      expect(result).to.containSubset({
        currentDistrict: 'Montreal',
        selectedIntersection: 'Concordia',
        districtLat: 111,
        districtLng: 222,
        defaultLat: 45.5017,
        defaultLng: -73.5673,
        zoom: 15,
      });
    });
  });
});
