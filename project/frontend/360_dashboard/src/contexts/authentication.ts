/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import { call, put, takeLatest } from 'redux-saga/effects';
import authenticateUser, { Response as authResponse } from '../api/authenticateUser';

export interface STATE {
  sessionToken: string;
  username: string;
  timestamp: string;
  error: string;
  user_id: number;
  is_staff: boolean;
}

// initState
export const initState: STATE = {
  sessionToken: '',
  username: '',
  timestamp: '',
  error: '',
  user_id: 0,
  is_staff: false,
};

// actions
export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_TEST = 'AUTHENTICATE_TEST';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const GET_USER_DATA = 'GET_USER_DATA';
export const LOGOUT = 'LOGOUT';

export interface AuthAction {
  type: string;
  username: string;
  password: string;
}

// authentication base case
export const authenticate = (username: string, password: string): AuthAction => ({
  type: AUTHENTICATE,
  username,
  password,
});

interface AuthSuccessAction {
  type: string;
  data: authResponse;
}

// authentication success case
export const authSuccess = (data: authResponse): AuthSuccessAction => ({
  type: AUTHENTICATE_SUCCESS,
  data,
});

interface AuthFailAction {
  type: string;
}

// authentication fail case
export const authFail = (): AuthFailAction => ({
  type: AUTHENTICATE_FAIL,
});

export interface LogoutAction {
  type: string;
}

export interface GetUserDataAction {
  type: string;
}

// get user data
export const getUserData = (): GetUserDataAction => ({
  type: GET_USER_DATA,
});

// selector

// check for authentication
export const authenticated = (state: { authentication: STATE }): boolean => state.authentication.user_id !== 0 && state.authentication.username !== '';

// check for staff privilege status
export const isStaff = (state: { authentication: STATE }): boolean => state.authentication.is_staff === true;

// logout
export const logout = (): LogoutAction => ({
  type: LOGOUT,
});

// SAGA
export function* handleAuthentication({ username, password }: AuthAction): Iterator<any> {
  try {
    const data = yield call(authenticateUser, username, password);
    if (data !== undefined) {
      yield put(authSuccess(data));
    }
  } catch (e) {
    yield put(authFail());
    throw e;
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(AUTHENTICATE, handleAuthentication);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case AUTHENTICATE_TEST: {
      return {
        ...state,
        sessionToken: 'TEST',
        username: 'TEST',
        user_id: 1,
      };
    }
    case AUTHENTICATE_SUCCESS: {
      const { data } = action as AuthSuccessAction;
      const d = new Date();
      if (data.user_id === undefined) {
        return {
          ...state,
          error: 'Invalid credentials.',
        };
      }
      localStorage.setItem('user', JSON.stringify(data));
      return {
        ...state,
        sessionToken: `${data.username}-${data.user_id}`,
        username: data.username,
        timestamp: d.toUTCString(),
        error: '',
        user_id: data.user_id,
        is_staff: data.is_staff,
      };
    }
    case AUTHENTICATE_FAIL: {
      return {
        sessionToken: initState.sessionToken,
        username: initState.username,
        timestamp: initState.timestamp,
        error: 'Invalid credentials.',
        user_id: initState.user_id,
        is_staff: false,
      };
    }
    case GET_USER_DATA: {
      if (localStorage.getItem('user') !== null) {
        const data: any = localStorage.getItem('user');
        const d = new Date();
        return {
          ...state,
          sessionToken: `${JSON.parse(data).username}-${JSON.parse(data).user_id}`,
          username: JSON.parse(data).username,
          timestamp: d.toUTCString(),
          error: '',
          user_id: JSON.parse(data).user_id,
          is_staff: JSON.parse(data).is_staff,
        };
      }
      return initState;
    }
    case LOGOUT: {
      localStorage.clear();
      return {
        ...initState,
      };
    }
    default:
      return state;
  }
}
