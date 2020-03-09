/* eslint-disable @typescript-eslint/camelcase */
import { Action } from 'redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  Response as intersectionResponse,
  addIntersection,
  editIntersection,
  deleteIntersection,
  getIntersection,
} from '../api/intersection';
import { Response as cameraResponse } from '../api/camera';

export interface STATE {
  intersection_id: string;
  latitude: string;
  longitude: string;
  intersection_name: string;
  district_id: string;
  cameras: [cameraResponse] | [];
  error: string;
  success: boolean;
}

// initState
const initState: STATE = {
  intersection_id: '',
  latitude: '',
  longitude: '',
  intersection_name: '',
  district_id: '',
  cameras: [],
  error: '',
  success: false,
};

// actions
export const RESET_INTERSECTION = 'RESET_INTERSECTION';

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

export interface ResetIntersectionAction {
  type: string;
}

// reset intersection state
export const resetIntersection = (): ResetIntersectionAction => ({
  type: RESET_INTERSECTION,
});

// ADD
export interface AddIntersectionAction extends Action {
  intersection_name: string;
  latitude: string;
  longitude: string;
  district_id: string;
  user_id: string;
}

// base case
export const addNewIntersection = (
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
  user_id: string,
): AddIntersectionAction => ({
  type: ADD_INTERSECTION,
  intersection_name,
  latitude,
  longitude,
  district_id,
  user_id,
});

export interface AddIntersectionSuccessAction {
  type: string;
  data: intersectionResponse;
}

// success case
export const addIntersectionSuccess = (
  data: intersectionResponse,
): AddIntersectionSuccessAction => ({
  type: ADD_INTERSECTION_SUCCESS,
  data,
});

export interface AddIntersectionFail {
  type: string;
}

// fail case
export const addIntersectionFail = (): AddIntersectionFail => ({
  type: ADD_INTERSECTION_FAIL,
});

// READ
export interface GetIntersectionAction extends Action {
  type: string;
  id: string;
}

// base case
export const getExistingIntersection = (id: string): GetIntersectionAction => ({
  type: GET_INTERSECTION,
  id,
});

export interface GetIntersectionSuccessAction {
  type: string;
  data: intersectionResponse;
}

// success case
export const getIntersectionSuccess = (
  data: intersectionResponse,
): GetIntersectionSuccessAction => ({
  type: GET_INTERSECTION_SUCCESS,
  data,
});

export interface GetIntersectionFail {
  type: string;
}

// fail case
export const getIntersectionFail = (): GetIntersectionFail => ({
  type: GET_INTERSECTION_FAIL,
});

// UPDATE
export interface EditIntersectionAction extends Action {
  intersection_id: string;
  intersection_name: string;
  latitude: string;
  longitude: string;
  district_id: string;
}

// base case
export const editExistingIntersection = (
  intersection_id: string,
  intersection_name: string,
  latitude: string,
  longitude: string,
  district_id: string,
): EditIntersectionAction => ({
  type: EDIT_INTERSECTION,
  intersection_id,
  intersection_name,
  latitude,
  longitude,
  district_id,
});

export interface EditIntersectionSuccessAction {
  type: string;
  data: intersectionResponse;
}

// success case
export const editIntersectionSuccess = (
  data: intersectionResponse,
): EditIntersectionSuccessAction => ({
  type: EDIT_INTERSECTION_SUCCESS,
  data,
});

export interface EditIntersectionFail {
  type: string;
}

// fail case
export const editIntersectionFail = (): EditIntersectionFail => ({
  type: EDIT_INTERSECTION_FAIL,
});

// DELETE
export interface DeleteIntersectionAction extends Action {
  id: string;
}

// base case
export const deleteExistingIntersection = (id: string): DeleteIntersectionAction => ({
  type: DELETE_INTERSECTION,
  id,
});

export interface DeleteIntersectionSuccessAction {
  type: string;
  id: string;
}

// success case
export const deleteIntersectionSuccess = (id: string): DeleteIntersectionSuccessAction => ({
  type: DELETE_INTERSECTION_SUCCESS,
  id,
});

export interface DeleteIntersectionFail {
  type: string;
}

// fail case
export const deleteIntersectionFail = (): DeleteIntersectionFail => ({
  type: DELETE_INTERSECTION_FAIL,
});

// SAGA

// create
export function* handleAddIntersection({
  intersection_name,
  latitude,
  longitude,
  district_id,
  user_id,
}: AddIntersectionAction): Iterator<any> {
  try {
    const data = yield call(
      addIntersection,
      intersection_name,
      latitude,
      longitude,
      district_id,
      user_id,
    );
    if (data !== undefined) {
      yield put(addIntersectionSuccess(data));
    }
  } catch (e) {
    yield put(addIntersectionFail());
  }
}

// read
export function* handleGetIntersection({ id }: GetIntersectionAction): Iterator<any> {
  try {
    const data = yield call(getIntersection, id);
    if (data !== undefined) {
      yield put(getIntersectionSuccess(data));
    }
  } catch (e) {
    yield put(getIntersectionFail());
  }
}

// update
export function* handleEditIntersection({
  intersection_id,
  intersection_name,
  latitude,
  longitude,
  district_id,
}: EditIntersectionAction): Iterator<any> {
  try {
    const data = yield call(
      editIntersection,
      intersection_id,
      intersection_name,
      latitude,
      longitude,
      district_id,
    );
    if (data !== undefined) {
      yield put(editIntersectionSuccess(data));
    }
  } catch (e) {
    yield put(editIntersectionFail());
  }
}

// delete
export function* handleDeleteIntersection({ id }: DeleteIntersectionAction): Iterator<any> {
  try {
    yield call(deleteIntersection, id);
    yield put({ type: DELETE_INTERSECTION_SUCCESS });
  } catch (e) {
    yield put(deleteIntersectionFail());
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(ADD_INTERSECTION, handleAddIntersection);
  yield takeLatest(GET_INTERSECTION, handleGetIntersection);
  yield takeLatest(EDIT_INTERSECTION, handleEditIntersection);
  yield takeLatest(DELETE_INTERSECTION, handleDeleteIntersection);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case RESET_INTERSECTION: {
      return {
        ...state,
        intersection_id: '',
        latitude: '',
        longitude: '',
        intersection_name: '',
        district_id: '',
        cameras: [],
        error: '',
        success: false,
      };
    }
    case ADD_INTERSECTION_SUCCESS: {
      return {
        ...state,
        error: 'New intersection created.',
        success: true,
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
        cameras: data.cameras,
        error: '',
        success: true,
      };
    }
    case EDIT_INTERSECTION_SUCCESS: {
      return {
        ...state,
        error: 'Intersection updated.',
        success: true,
      };
    }
    case DELETE_INTERSECTION_SUCCESS: {
      return {
        ...state,
        error: 'Intersection deleted.',
        success: true,
      };
    }
    case ADD_INTERSECTION_FAIL: {
      return {
        ...state,
        error: 'Error while adding new intersection.',
        success: false,
      };
    }
    case GET_INTERSECTION_FAIL: {
      return {
        ...state,
        error: 'Error while getting existing intersection.',
        success: false,
      };
    }
    case EDIT_INTERSECTION_FAIL: {
      return {
        ...state,
        error: 'Error while editing existing intersection.',
        success: false,
      };
    }
    case DELETE_INTERSECTION_FAIL: {
      return {
        ...state,
        error: 'Error while deleting existing intersection.',
        success: false,
      };
    }
    default:
      return state;
  }
}
