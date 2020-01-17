/* eslint-disable @typescript-eslint/camelcase */
import { Action } from 'redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  Response as cameraResponse,
  addCamera,
  editCamera,
  deleteCamera,
  getCamera,
} from '../api/camera';

export interface STATE {
  id: number;
  camera_url: string;
  intersection_id: number;
  error: string;
  success: boolean;
}

// initState
const initState: STATE = {
  id: 0,
  camera_url: '',
  intersection_id: 0,
  error: '',
  success: false,
};

// actions
export const RESET_CAMERA = 'RESET_CAMERA';

export const ADD_CAMERA = 'ADD_CAMERA';
export const ADD_CAMERA_SUCCESS = 'ADD_CAMERA_SUCCESS';
export const ADD_CAMERA_FAIL = 'ADD_CAMERA_FAIL';

export const GET_CAMERA = 'GET_CAMERA';
export const GET_CAMERA_SUCCESS = 'GET_CAMERA_SUCCESS';
export const GET_CAMERA_FAIL = 'GET_CAMERA_FAIL';

export const EDIT_CAMERA = 'EDIT_CAMERA';
export const EDIT_CAMERA_SUCCESS = 'EDIT_CAMERA_SUCCESS';
export const EDIT_CAMERA_FAIL = 'EDIT_CAMERA_FAIL';

export const DELETE_CAMERA = 'DELETE_CAMERA';
export const DELETE_CAMERA_SUCCESS = 'DELETE_CAMERA_SUCCESS';
export const DELETE_CAMERA_FAIL = 'DELETE_CAMERA_FAIL';

export interface ResetCameraAction {
  type: string;
}

// reset camera state
export const resetCamera = (): ResetCameraAction => ({
  type: RESET_CAMERA,
});

// ADD
export interface AddCameraAction extends Action {
  camera_url: string;
  intersection_id: string;
}

// base case
export const addNewCamera = (camera_url: string, intersection_id: string): AddCameraAction => ({
  type: ADD_CAMERA,
  camera_url,
  intersection_id,
});

export interface AddCameraSuccessAction {
  type: string;
  data: cameraResponse;
}

// success case
export const addCameraSuccess = (data: cameraResponse): AddCameraSuccessAction => ({
  type: ADD_CAMERA_SUCCESS,
  data,
});

export interface AddCameraFail {
  type: string;
}

// fail case
export const addCameraFail = (): AddCameraFail => ({
  type: ADD_CAMERA_FAIL,
});

// READ
export interface GetCameraAction extends Action {
  type: string;
  id: string;
}

// base case
export const getExistingCamera = (id: string): GetCameraAction => ({
  type: GET_CAMERA,
  id,
});

export interface GetIntersectionSuccessAction {
  type: string;
  data: cameraResponse;
}

// success case
export const getCameraSuccess = (data: cameraResponse): GetIntersectionSuccessAction => ({
  type: GET_CAMERA_SUCCESS,
  data,
});

export interface GetCameraFail {
  type: string;
}

// fail case
export const getCameraFail = (): GetCameraFail => ({
  type: GET_CAMERA_FAIL,
});

// UPDATE
export interface EditCameraAction extends Action {
  id: string;
  camera_url: string;
  intersection_id: string;
}

// base case
export const editExistingCamera = (
  id: string,
  camera_url: string,
  intersection_id: string,
): EditCameraAction => ({
  type: EDIT_CAMERA,
  id,
  camera_url,
  intersection_id,
});

export interface EditCameraSuccessAction {
  type: string;
  data: cameraResponse;
}

// success case
export const editCameraSuccess = (data: cameraResponse): EditCameraSuccessAction => ({
  type: EDIT_CAMERA_SUCCESS,
  data,
});

export interface EditCameraFail {
  type: string;
}

// fail case
export const editCameraFail = (): EditCameraFail => ({
  type: EDIT_CAMERA_FAIL,
});

// DELETE
export interface DeleteCameraAction extends Action {
  id: string;
}

// base case
export const deleteExistingCamera = (id: string): DeleteCameraAction => ({
  type: DELETE_CAMERA,
  id,
});

export interface DeleteCameraSuccessAction {
  type: string;
  id: string;
}

// success case
export const deleteIntersectionSuccess = (id: string): DeleteCameraSuccessAction => ({
  type: DELETE_CAMERA_SUCCESS,
  id,
});

export interface DeleteCameraFail {
  type: string;
}

// fail case
export const deleteCameraFail = (): DeleteCameraFail => ({
  type: DELETE_CAMERA_FAIL,
});

// SAGA

// create
export function* handleAddCamera({ camera_url, intersection_id }: AddCameraAction): Iterator<any> {
  try {
    const data = yield call(addCamera, camera_url, intersection_id);
    if (data !== undefined) {
      yield put(addCameraSuccess(data));
    }
  } catch (e) {
    yield put(addCameraFail());
    throw e;
  }
}

// read
export function* handleGetCamera({ id }: GetCameraAction): Iterator<any> {
  try {
    const data = yield call(getCamera, id);
    if (data !== undefined) {
      yield put(getCameraSuccess(data));
    }
  } catch (e) {
    yield put(getCameraFail());
    throw e;
  }
}

// update
export function* handleEditCamera({
  id,
  camera_url,
  intersection_id,
}: EditCameraAction): Iterator<any> {
  try {
    const data = yield call(editCamera, id, camera_url, intersection_id);
    if (data !== undefined) {
      yield put(editCameraSuccess(data));
    }
  } catch (e) {
    yield put(editCameraFail());
    throw e;
  }
}

// delete
export function* handleDeleteCamera({ id }: DeleteCameraAction): Iterator<any> {
  try {
    yield call(deleteCamera, id);
    yield put({ type: DELETE_CAMERA_SUCCESS });
  } catch (e) {
    yield put(deleteCameraFail());
    throw e;
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(ADD_CAMERA, handleAddCamera);
  yield takeLatest(GET_CAMERA, handleGetCamera);
  yield takeLatest(EDIT_CAMERA, handleEditCamera);
  yield takeLatest(DELETE_CAMERA, handleDeleteCamera);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case RESET_CAMERA: {
      return {
        ...state,
        id: 0,
        camera_url: '',
        intersection_id: 0,
        error: '',
        success: false,
      };
    }
    case ADD_CAMERA_SUCCESS: {
      return {
        ...state,
        error: 'New camera created.',
        success: true,
      };
    }
    case GET_CAMERA_SUCCESS: {
      const { data } = action as GetIntersectionSuccessAction;
      return {
        ...state,
        id: data.id,
        camera_url: String(data.camera_url),
        intersection_id: data.id,
        error: '',
        success: true,
      };
    }
    case EDIT_CAMERA_SUCCESS: {
      return {
        ...state,
        error: 'Camera updated.',
        success: true,
      };
    }
    case DELETE_CAMERA_SUCCESS: {
      return {
        ...state,
        error: 'Camera deleted.',
        success: true,
      };
    }
    case ADD_CAMERA_FAIL: {
      return {
        ...state,
        error: 'Error while adding new camera.',
        success: false,
      };
    }
    case GET_CAMERA_FAIL: {
      return {
        ...state,
        error: 'Error while getting existing camera.',
        success: false,
      };
    }
    case EDIT_CAMERA_FAIL: {
      return {
        ...state,
        error: 'Error while editing existing camera.',
        success: false,
      };
    }
    case DELETE_CAMERA_FAIL: {
      return {
        ...state,
        error: 'Error while deleting existing camera.',
        success: false,
      };
    }
    default:
      return state;
  }
}
