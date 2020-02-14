/* eslint-disable @typescript-eslint/camelcase */
import { call, put, takeEvery } from 'redux-saga/effects';
import fetchIntensity, { Response as trafficResponse } from '../api/fetchIntensity';

export interface STATE {
  [cameraId: number]: {
    los: number;
  };
}

// initState
const initState: STATE = {
  0: { los: 0 },
};

// actions
export const GET_TRAFFIC = 'GET_TRAFFIC';
export const GET_TRAFFIC_SUCCESS = 'GET_TRAFFIC_SUCCESS';
export const GET_TRAFFIC_FAIL = 'GET_TRAFFIC_FAIL';
export const RESET_TRAFFIC = 'RESET_TRAFFIC';

export interface GetTrafficAction {
  type: string;
  cameraID: number;
  cameraIP: string;
}

// get traffic base case
export const getTraffic = (cameraID: number, cameraIP: string): GetTrafficAction => ({
  type: GET_TRAFFIC,
  cameraID,
  cameraIP,
});

export interface GetTrafficSuccessAction {
  type: string;
  cameraID: number;
  data: trafficResponse;
}

// get traffic success case
export const getTrafficSuccess = (
  cameraID: number,
  data: trafficResponse,
): GetTrafficSuccessAction => ({
  type: GET_TRAFFIC_SUCCESS,
  cameraID,
  data,
});

export interface GetTrafficFailAction {
  type: string;
  cameraID: number;
}

// get traffic fail case
export const getTrafficFail = (cameraID: number): GetTrafficFailAction => ({
  type: GET_TRAFFIC_FAIL,
  cameraID,
});

export interface ResetTrafficAction {
  type: string;
}

// reset traffic state
export const resetIntersection = (): ResetTrafficAction => ({
  type: RESET_TRAFFIC,
});

// SAGA
export function* handleFetchTraffic({ cameraID, cameraIP }: GetTrafficAction): Iterator<any> {
  try {
    const data = yield call(fetchIntensity, cameraIP);
    if (data !== undefined) {
      yield put(getTrafficSuccess(cameraID, data));
    }
  } catch (e) {
    yield put(getTrafficFail(cameraID));
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeEvery(GET_TRAFFIC, handleFetchTraffic);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case GET_TRAFFIC_SUCCESS: {
      const { data, cameraID } = action as GetTrafficSuccessAction;
      return {
        ...state,
        [cameraID]: data,
      };
    }
    case GET_TRAFFIC_FAIL: {
      const { cameraID } = action as GetTrafficFailAction;
      return {
        ...state,
        [cameraID]: {
          los: -1,
        },
      };
    }
    case RESET_TRAFFIC: {
      return {
        ...state,
        ...initState,
      };
    }
    default:
      return state;
  }
}
