import {
    call,
    put,
    takeLatest,
  } from 'redux-saga/effects';
import authenticateUser, { authResponse } from '../api/authenticateUser';

export interface STATE {
    session_token: string;
    name: string;
    email: string;
}

const initState: STATE = {
    session_token: "",
    name: "",
    email: "",
}

export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';

export interface authAction {
    type: string;
    email: string;
    password: string;
}

export const authenticate = (email: string, password: string): authAction => ({
    type: AUTHENTICATE,
    email,
    password,
});

interface AuthSuccessAction {
    type: string;
    data: authResponse;
}
export const getHelloSuccess = (
    data: authResponse,
): AuthSuccessAction => ({
    type: AUTHENTICATE_SUCCESS,
    data,
});

interface GetHelloFailAction {
    type: string;
}

export const getHelloFail = (): GetHelloFailAction => ({
    type: AUTHENTICATE_FAIL,
});

// SAGA
export function* handleAuthentication({ email, password }: authAction): Iterator<any> {
    try {
      const APIDomain = '127.0.0.1:8000';
      console.log("handleAuthentication");
      const data = yield call(authenticateUser, APIDomain, email, password);
      console.log("DATA:" + data);
      if (data !== undefined) {
        yield put(getHelloSuccess(data));
      }
    } catch (e) {
      yield put(getHelloFail());
      throw e;
    }
}

export function* saga(): Iterator<any> {
    console.log("SAGA");
    yield takeLatest(AUTHENTICATE, handleAuthentication);
}

export default function reducer(state: STATE = initState, action: any): any {
    console.log("REDUCER " + action.type);
    switch (action.type) {
        case AUTHENTICATE_SUCCESS: {
            const { data } = action as AuthSuccessAction;
            console.log(action.type);
            return {
                ...state,
                session_token: data.session_token,
                name: data.name,
                email: data.email,
            };
        }
        default:
            return state;
    }
}