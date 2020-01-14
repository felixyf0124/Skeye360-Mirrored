/* eslint-disable @typescript-eslint/camelcase */
import { Action } from 'redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { Response as countResponse, getCount } from '../api/vehicleCount';

export interface STATE {
  intersection_id: number;
  los: number;
  error: string;
  success: boolean;
}

// initState
const initState: STATE = {
  intersection_id: 0,
  los: -1,
  error: '',
  success: false,
};

// actions
export const GET_COUNT = 'GET_COUNT';
export const GET_COUNT_SUCCESS = 'GET_COUNT_SUCCESS';
export const GET_COUNT_FAIL = 'GET_COUNT_FAIL';

// READ
export interface GetCountAction extends Action {
  type: string;
  cameraUrl: string;
}

// base case
export const getCurrentCount = (cameraUrl: string): GetCountAction => ({
  type: GET_COUNT,
  cameraUrl,
});

export interface GetCountSuccessAction {
  type: string;
  data: countResponse;
}

// success case
export const getCountSuccess = (data: countResponse): GetCountSuccessAction => ({
  type: GET_COUNT_SUCCESS,
  data,
});

export interface GetCountFail {
  type: string;
}

// fail case
export const getCountFail = (): GetCountFail => ({
  type: GET_COUNT_FAIL,
});

// SAGA
// read
export function* handleGetCount(cameraUrl: any): Iterator<any> {
  try {
    const data = yield call(getCount, cameraUrl);
    if (data !== undefined) {
      yield put(getCountSuccess(data));
    }
  } catch (e) {
    yield put(getCountFail());
    throw e;
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(GET_COUNT, handleGetCount);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case GET_COUNT_SUCCESS: {
      const { data } = action as GetCountSuccessAction;
      return {
        ...state,
        intersection_id: data.intersection_id,
        los: data.los,
        error: '',
        success: true,
      };
    }
    case GET_COUNT_FAIL: {
      return {
        ...initState,
        error: 'Error while getting existing count.',
        success: false,
      };
    }
    default:
      return state;
  }
}
