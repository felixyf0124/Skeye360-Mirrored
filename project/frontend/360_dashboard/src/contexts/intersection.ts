/* eslint-disable @typescript-eslint/camelcase */
import {
  call,
  put,
} from 'redux-saga/effects';
import addIntersection, { Response as intersectionResponse } from '../api/addIntersection';

export interface STATE {
  error: string;
}

const initState: STATE = {
  error: '',
};

export const ADD_INTERSECTION = 'ADD_INTERSECTION';
export const ADD_INTERSECTION_SUCCESS = 'ADD_INTERSECTION_SUCCESS';
export const ADD_INTERSECTION_FAIL = 'ADD_INTERSECTION_FAIL';

export interface AddIntersectionAction {
  type: string;
  intersection_name: string;
  latitude: string;
  longitude: string;
  district_id: string;
}

export const addNewIntersection = (
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
): AddIntersectionAction => ({
  type: ADD_INTERSECTION,
  intersection_name,
  latitude,
  longitude,
  district_id,
});

export interface AddIntersectionSuccessAction {
  type: string;
  data: intersectionResponse;
}

export const AddIntersectionSuccess = (
  data: intersectionResponse,
): AddIntersectionSuccessAction => ({
  type: ADD_INTERSECTION_SUCCESS,
  data,
});

export interface AddIntersectionFail {
  type: string;
}

export const AddIntersectionFail = (): AddIntersectionFail => ({
  type: ADD_INTERSECTION_FAIL,
});

// SAGA
export function* handleAddIntersection(
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
): Iterator<any> {
  try {
    const data = yield call(addIntersection, intersection_name, latitude, longitude, district_id);
    if (data !== undefined) {
      yield put(AddIntersectionSuccess(data));
    }
  } catch (e) {
    yield put(AddIntersectionFail());
    throw e;
  }
}

export function* saga(): Iterator<any> {
  yield (call as any)(ADD_INTERSECTION, handleAddIntersection);
}

export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case ADD_INTERSECTION_SUCCESS: {
      return {
        ...state,
      };
    }
    case ADD_INTERSECTION_FAIL: {
      return {
        ...state,
        error: 'Error while adding new intersection.',
      };
    }
    default:
      return state;
  }
}
