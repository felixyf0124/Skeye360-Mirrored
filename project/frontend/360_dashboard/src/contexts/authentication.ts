import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import authenticateUser, { Response as authResponse } from '../api/authenticateUser';

export interface STATE {
    sessionToken: string;
    username: string;
    timestamp: string;
    authenticated: boolean;
    error: string;
}

const initState: STATE = {
  sessionToken: '',
  username: '',
  timestamp: '',
  authenticated: false,
  error: '',
};

export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_TEST = 'AUTHENTICATE_TEST';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const LOGOUT = 'LOGOUT';

export interface AuthAction {
    type: string;
    username: string;
    password: string;
}

export const authenticate = (username: string, password: string): AuthAction => ({
  type: AUTHENTICATE_TEST,
  username,
  password,
});

export interface LogoutAction {
    type: string;
}

export const logout = (): LogoutAction => ({
  type: LOGOUT,
});

interface AuthSuccessAction {
    type: string;
    data: authResponse;
}
export const authSuccess = (
  data: authResponse,
): AuthSuccessAction => ({
  type: AUTHENTICATE_SUCCESS,
  data,
});

interface AuthFailAction {
    type: string;
}

export const authFail = (): AuthFailAction => ({
  type: AUTHENTICATE_FAIL,
});

// SAGA
export function* handleAuthentication({ username, password }: AuthAction): Iterator<any> {
  try {
    // console.log(`handleAuthentication${username}${password}`);
    const data = yield call(authenticateUser, username, password);
    if (data !== undefined) {
      yield put(authSuccess(data));
    }
  } catch (e) {
    yield put(authFail());
    throw e;
  }
}

export function* saga(): Iterator<any> {
  // console.log("SAGA");
  yield takeLatest(AUTHENTICATE, handleAuthentication);
}

export default function reducer(state: STATE = initState, action: any): STATE {
  // console.log("REDUCER " + action.type);
  switch (action.type) {
    case AUTHENTICATE_TEST: {
      return {
        ...state,
        sessionToken: 'TEST',
        username: 'TEST',
        authenticated: true,
      };
    }
    case AUTHENTICATE_SUCCESS: {
      const { data } = action as AuthSuccessAction;
      // console.log(action.type);
      return {
        ...state,
        sessionToken: data.token,
        username: data.username,
        timestamp: data.timestamp,
        authenticated: true,
      };
    }
    case AUTHENTICATE_FAIL: {
      return {
        sessionToken: initState.sessionToken,
        username: initState.username,
        timestamp: initState.timestamp,
        authenticated: initState.authenticated,
        error: 'Invalid credentials.',
      };
    }
    case LOGOUT: {
      return {
        sessionToken: initState.sessionToken,
        username: initState.username,
        timestamp: initState.timestamp,
        authenticated: initState.authenticated,
        error: initState.error,
      };
    }
    default:
      return state;
  }
}
