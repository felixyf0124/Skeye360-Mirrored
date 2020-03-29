/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/camelcase */
import { Action } from 'redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  Response as profileResponse,
  getProfile,
} from '../api/profile';

export interface STATE {
  id: any;
  error: any;
  email: any;
  is_staff: boolean;
  username: any;
  success: boolean;
}

// initState
const initState: STATE = {
  id: '0',
  email: '',
  is_staff: false,
  username: '',
  error: '',
  success: false,
};

// actions
export const GET_PROFILE = 'GET_PROFILE';
export const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS';
export const GET_PROFILE_FAIL = 'GET_PROFILE_FAIL';

// GET PROFILE
export interface ProfileAction extends Action {
  type: string;
  id: string;
}

// base case
export const profile = (
  id: any,
): ProfileAction => ({
  type: GET_PROFILE,
  id,
});

export interface ProfileSuccessAction {
  type: string;
  data: profileResponse;
}

// success case
export const profileSuccess = (
  data: profileResponse,
): ProfileSuccessAction => ({
  type: GET_PROFILE_SUCCESS,
  data,
});

export interface ProfileFail {
  type: string;
}

// fail case
export const profileFail = (): ProfileFail => ({
  type: GET_PROFILE_FAIL,
});

export function* handleGetProfile(
  { id }: ProfileAction,
): Iterator<any> {
  try {
    const data = yield call(getProfile, id);
    if (data !== undefined) {
      yield put(profileSuccess(data));
    }
  } catch (e) {
    yield put(profileFail());
    throw e;
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(GET_PROFILE, handleGetProfile);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case GET_PROFILE_SUCCESS: {
      const { data } = action as ProfileSuccessAction;
      if (data === undefined) {
        return {
          ...state,
          error: '',
        };
      }
      localStorage.setItem('user', JSON.stringify(data));
      return {
        ...state,
        id: data.id,
        email: data.email,
        is_staff: data.is_staff,
        username: data.username,
        error: '',
        success: true,
      };
    }
    case GET_PROFILE_FAIL: {
      return {
        id: initState.id,
        email: initState.email,
        is_staff: initState.is_staff,
        username: initState.username,
        error: 'Failed to get profile.',
        success: false,
      };
    }
    default:
      return state;
  }
}
