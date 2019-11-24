/* eslint-disable @typescript-eslint/camelcase */
import { call, put, takeLatest } from 'redux-saga/effects';
import authenticateUser, { Response as authResponse } from '../api/authenticateUser';

export interface STATE {
  sessionToken: string;
  username: string;
  timestamp: string;
  error: string;
  user_id: number;
}

// initState
export const initState: STATE = {
  sessionToken: '',
  username: '',
  timestamp: '',
  error: '',
  user_id: 0,
};

// actions
export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_TEST = 'AUTHENTICATE_TEST';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const GET_USER_DATA = 'GET_USER_DATA';
export const LOGOUT = 'LOGOUT';

// selector
export const authenticated = (): boolean => {
  if (localStorage.getItem('user') !== null) {
    return true;
  }
  return false;
};

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

interface GetUserDataAction {
  type: string;
  data: STATE;
}

// get user data
export const getUserData = (data: STATE): GetUserDataAction => ({
  type: GET_USER_DATA,
  data,
});

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
      };
    }
    case AUTHENTICATE_FAIL: {
      return {
        sessionToken: initState.sessionToken,
        username: initState.username,
        timestamp: initState.timestamp,
        error: 'Invalid credentials.',
        user_id: initState.user_id,
      };
    }
    case GET_USER_DATA: {
      const { data } = action as GetUserDataAction;
      if (localStorage.getItem('user') !== null) {
        return {
          ...state,
          sessionToken: data.sessionToken,
          username: data.username,
          timestamp: data.timestamp,
          error: '',
          user_id: data.user_id,
        };
      }
      return initState;
    }
    case LOGOUT: {
      localStorage.removeItem('user');
      return {
        sessionToken: initState.sessionToken,
        username: initState.username,
        timestamp: initState.timestamp,
        error: initState.error,
        user_id: initState.user_id,
      };
    }
    default:
      return state;
  }
}
