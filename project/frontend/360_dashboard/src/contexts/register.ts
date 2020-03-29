/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/camelcase */
import { call, put, takeLatest } from 'redux-saga/effects';
import registerUser, {
  Response as registerResponse,
} from '../api/register';

export interface STATE {
  sessionToken: string;
  username: string;
  password: string;
  email: string;
  error: string;
  is_staff: boolean;
  success: boolean;
}

// initState
const initState: STATE = {
  sessionToken: '',
  username: '',
  password: '',
  email: '',
  error: '',
  is_staff: false,
  success: false,
};

// actions
export const REGISTER = 'REGISTER';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const GET_USER_DATA = 'GET_USER_DATA';


// REGISTER
export interface RegisterAction {
  type: string;
  username: string;
  password: string;
  email: string;
  is_staff: boolean;
}

// base case
export const register = (
  username: string,
  password: string,
  email: string,
  is_staff: boolean,
): RegisterAction => ({
  type: REGISTER,
  username,
  password,
  email,
  is_staff,
});

export interface RegisterSuccessAction {
  type: string;
  data: registerResponse;
}

// success case
export const registerSuccess = (
  data: registerResponse,
): RegisterSuccessAction => ({
  type: REGISTER_SUCCESS,
  data,
});

export interface RegisterFail {
  type: string;
}

// fail case
export const registerFail = (): RegisterFail => ({
  type: REGISTER_FAIL,
});

export interface GetUserDataAction {
  type: string;
}
// get user data
export const getUserData = (): GetUserDataAction => ({
  type: GET_USER_DATA,
});

// selector

// check for registeration
export const registered = (state: { register: STATE }): boolean => state.register.success;
// SAGA

// create
export function* handleRegister({
  username,
  password,
  email,
  is_staff,
}: RegisterAction): Iterator<any> {
  try {
    const data = yield call(registerUser, username, password, email, is_staff);
    if (data !== undefined) {
      console.log(data);
      yield put(registerSuccess(data));
    }
  } catch (e) {
    yield put(registerFail());
    throw e;
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(REGISTER, handleRegister);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case REGISTER_SUCCESS: {
      const { data } = action as RegisterSuccessAction;
      if (data.username === undefined) {
        return {
          ...state,
          error: 'Username already exists',
        };
      }

      return {
        ...state,
        sessionToken: `${data.username}-${data.email}`,
        username: data.username,
        email: data.email,
        error: '',
        success: true,
      };
    }
    case REGISTER_FAIL: {
      return {
        sessionToken: initState.sessionToken,
        username: initState.username,
        email: initState.email,
        password: initState.password,
        error: 'Invalid Input.',
        is_staff: false,
        success: false,
      };
    }

    default:
      return state;
  }
}
