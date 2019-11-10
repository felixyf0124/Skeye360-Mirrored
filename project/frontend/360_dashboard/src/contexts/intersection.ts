/* eslint-disable @typescript-eslint/camelcase */
import { Action } from 'redux';
import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import {
  Response as intersectionResponse,
  addIntersection,
  editIntersection,
  deleteIntersection,
  getIntersection,
} from '../api/intersection';

export interface STATE {
  intersection_id: string;
  latitude: string;
  longitude: string;
  intersection_name: string;
  district_id: string;
  error: string;
}

const initState: STATE = {
  intersection_id: '',
  latitude: '',
  longitude: '',
  intersection_name: '',
  district_id: '',
  error: '',
};

export const ADD_INTERSECTION = 'ADD_INTERSECTION';
export const ADD_INTERSECTION_SUCCESS = 'ADD_INTERSECTION_SUCCESS';
export const ADD_INTERSECTION_FAIL = 'ADD_INTERSECTION_FAIL';

export const GET_INTERSECTION = 'GET_INTERSECTION';
export const GET_INTERSECTION_SUCCESS = 'GET_INTERSECTION_SUCCESS';
export const GET_INTERSECTION_FAIL = 'GET_INTERSECTION_FAIL';

export const EDIT_INTERSECTION = 'EDIT_INTERSECTION';
export const EDIT_INTERSECTION_SUCCESS = 'EDIT_INTERSECTION_SUCCESS';
export const EDIT_INTERSECTION_FAIL = 'EDIT_INTERSECTION_FAIL';

export const DELETE_INTERSECTION = 'DELETE_INTERSECTION';
export const DELETE_INTERSECTION_SUCCESS = 'DELETE_INTERSECTION_SUCCESS';
export const DELETE_INTERSECTION_FAIL = 'DELETE_INTERSECTION_FAIL';

// ADD
export interface AddIntersectionAction extends Action {
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

export const addIntersectionSuccess = (
  data: intersectionResponse,
): AddIntersectionSuccessAction => ({
  type: ADD_INTERSECTION_SUCCESS,
  data,
});

export interface AddIntersectionFail {
  type: string;
}

export const addIntersectionFail = (): AddIntersectionFail => ({
  type: ADD_INTERSECTION_FAIL,
});

// GET
export interface GetIntersectionAction extends Action {
  type: string;
  id: string;
}

export const getExistingIntersection = (
  id: string,
): GetIntersectionAction => ({
  type: GET_INTERSECTION,
  id,
});

export interface GetIntersectionSuccessAction {
  type: string;
  data: intersectionResponse;
}

export const getIntersectionSuccess = (
  data: intersectionResponse,
): GetIntersectionSuccessAction => ({
  type: GET_INTERSECTION_SUCCESS,
  data,
});

export interface GetIntersectionFail {
  type: string;
}

export const getIntersectionFail = (): GetIntersectionFail => ({
  type: GET_INTERSECTION_FAIL,
});

// EDIT
export interface EditIntersectionAction extends Action {
  intersection_name: string;
  latitude: string;
  longitude: string;
  district_id: string;
}

export const editNewIntersection = (
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
): EditIntersectionAction => ({
  type: EDIT_INTERSECTION,
  intersection_name,
  latitude,
  longitude,
  district_id,
});

export interface EditIntersectionSuccessAction {
  type: string;
  data: intersectionResponse;
}

export const editIntersectionSuccess = (
  data: intersectionResponse,
): EditIntersectionSuccessAction => ({
  type: EDIT_INTERSECTION_SUCCESS,
  data,
});

export interface EditIntersectionFail {
  type: string;
}

export const editIntersectionFail = (): EditIntersectionFail => ({
  type: EDIT_INTERSECTION_FAIL,
});

// DELETE
export interface DeleteIntersectionAction extends Action {
  id: string;
}

export const deleteExistingIntersection = (
  id: string,
): DeleteIntersectionAction => ({
  type: DELETE_INTERSECTION,
  id,
});

export interface DeleteIntersectionSuccessAction {
  type: string;
  id: string;
}

export const deleteIntersectionSuccess = (
  id: string,
): DeleteIntersectionSuccessAction => ({
  type: DELETE_INTERSECTION_SUCCESS,
  id,
});

export interface DeleteIntersectionFail {
  type: string;
}

export const deleteIntersectionFail = (): DeleteIntersectionFail => ({
  type: DELETE_INTERSECTION_FAIL,
});

// SAGA
export function* handleAddIntersection({
  intersection_name,
  latitude,
  longitude,
  district_id,
}: AddIntersectionAction): Iterator<any> {
  try {
    const data = yield call(addIntersection, intersection_name, latitude, longitude, district_id);
    if (data !== undefined) {
      yield put(addIntersectionSuccess(data));
    }
  } catch (e) {
    yield put(addIntersectionFail());
    throw e;
  }
}

export function* handleGetIntersection({
  id,
}: GetIntersectionAction): Iterator<any> {
  try {
    const data = yield call(getIntersection, id);
    if (data !== undefined) {
      yield put(getIntersectionSuccess(data));
    }
  } catch (e) {
    yield put(getIntersectionFail());
    throw e;
  }
}

export function* handleEditIntersection({
  intersection_name,
  latitude,
  longitude,
  district_id,
}: EditIntersectionAction): Iterator<any> {
  try {
    const data = yield call(editIntersection, intersection_name, latitude, longitude, district_id);
    if (data !== undefined) {
      yield put(editIntersectionSuccess(data));
    }
  } catch (e) {
    yield put(editIntersectionFail());
    throw e;
  }
}

export function* handleDeleteIntersection({
  id,
}: DeleteIntersectionAction): Iterator<any> {
  try {
    yield call(deleteIntersection, id);
    yield put({ type: DELETE_INTERSECTION_SUCCESS });
  } catch (e) {
    yield put(deleteIntersectionFail());
    throw e;
  }
}

export function* saga(): Iterator<any> {
  yield takeLatest(ADD_INTERSECTION, handleAddIntersection);
  yield takeLatest(GET_INTERSECTION, handleGetIntersection);
  yield takeLatest(EDIT_INTERSECTION, handleEditIntersection);
  yield takeLatest(DELETE_INTERSECTION, handleDeleteIntersection);
}

export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case ADD_INTERSECTION_SUCCESS: {
      return {
        ...state,
        error: 'New intersection created.',
      };
    }
    case GET_INTERSECTION_SUCCESS: {
      const { data } = action as GetIntersectionSuccessAction;
      return {
        ...state,
        intersection_name: data.intersection_name,
        latitude: String(data.latitude),
        longitude: String(data.longitude),
        district_id: String(data.district_id),
        intersection_id: String(data.id),
        error: '',
      };
    }
    case EDIT_INTERSECTION_SUCCESS: {
      return {
        ...state,
        error: 'Intersection updated.',
      };
    }
    case DELETE_INTERSECTION_SUCCESS: {
      return {
        ...state,
        error: 'Intersection deleted.',
      };
    }
    case ADD_INTERSECTION_FAIL: {
      return {
        ...state,
        error: 'Error while adding new intersection.',
      };
    }
    case GET_INTERSECTION_FAIL: {
      return {
        ...state,
        error: 'Error while getting existing intersection.',
      };
    }
    case EDIT_INTERSECTION_FAIL: {
      return {
        ...state,
        error: 'Error while editing new intersection.',
      };
    }
    case DELETE_INTERSECTION_FAIL: {
      return {
        ...state,
        error: 'Error while deleting new intersection.',
      };
    }
    default:
      return state;
  }
}
