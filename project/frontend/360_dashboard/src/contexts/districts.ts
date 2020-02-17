/* eslint-disable @typescript-eslint/camelcase */
import { call, put, takeLatest } from 'redux-saga/effects';
import fetchDistricts, { Response as districtResponse } from '../api/fetchDistricts';
import { STATE as CAMERA_STATE } from './camera';

export interface STATE {
  [district: string]: {
    id: number;
    district_name: string;
    intersections: {
      id: number;
      intersection_name: string;
      latitude: number;
      cameras: CAMERA_STATE[] | any;
      longitude: number;
      district_id: number;
    }[];
  }[];
}

// initState
const initState: STATE = {};

// actions
export const GET_DISTRICTS = 'GET_DISTRICTS';
export const GET_DISTRICTS_SUCCESS = 'GET_DISTRICTS_SUCCESS';
export const GET_DISTRICTS_FAIL = 'GET_DISTRICTS_FAIL';
export const RESET_INTERSECTION = 'RESET_INTERSECTION';

export interface GetDistrictsAction {
  type: string;
}

// get district base case
export const getDistricts = (): GetDistrictsAction => ({
  type: GET_DISTRICTS,
});

export interface GetDistrictsSuccessAction {
  type: string;
  data: districtResponse;
}

// get district success case
export const getDistrictsSuccess = (data: districtResponse): GetDistrictsSuccessAction => ({
  type: GET_DISTRICTS_SUCCESS,
  data,
});

export interface GetDistrictsFailAction {
  type: string;
}

// get district fail case
export const getDistrictsFail = (): GetDistrictsFailAction => ({
  type: GET_DISTRICTS_FAIL,
});

export interface ResetDistrictAction {
  type: string;
}

// reset district state
export const resetIntersection = (): ResetDistrictAction => ({
  type: RESET_INTERSECTION,
});

// SAGA
export function* handleFetchDistricts(): Iterator<any> {
  try {
    const data = yield call(fetchDistricts);
    if (data !== undefined) {
      yield put(getDistrictsSuccess(data));
    }
  } catch (e) {
    yield put(getDistrictsFail());
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(GET_DISTRICTS, handleFetchDistricts);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case GET_DISTRICTS_SUCCESS: {
      const { data } = action as GetDistrictsSuccessAction;
      return {
        ...state,
        ...data,
      };
    }
    case GET_DISTRICTS_FAIL: {
      return {
        ...state,
      };
    }
    case RESET_INTERSECTION: {
      return {
        ...state,
        ...initState,
      };
    }
    default:
      return state;
  }
}
