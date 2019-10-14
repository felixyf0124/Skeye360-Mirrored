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
    authenticated: boolean;
}

const initState: STATE = {
    session_token: "",
    name: "",
    email: "",
    authenticated: false,
}

export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const LOGOUT = 'LOGOUT';

export interface AuthAction {
    type: string;
    email: string;
    password: string;
}

export const authenticate = (email: string, password: string): AuthAction => ({
    type: AUTHENTICATE,
    email,
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

interface authgFailAction {
    type: string;
}

export const authFail = (): authgFailAction => ({
    type: AUTHENTICATE_FAIL,
});

// SAGA
export function* handleAuthentication({ email, password }: AuthAction): Iterator<any> {
    try {
      const APIDomain = '127.0.0.1:8000';
      console.log("handleAuthentication");
      const data = yield call(authenticateUser, APIDomain, email, password);
      console.log("DATA:" + data);
      if (data !== undefined) {
        yield put(authSuccess(data));
      }
    } catch (e) {
      yield put(authFail());
      throw e;
    }
}

export function* saga(): Iterator<any> {
    console.log("SAGA");
    yield takeLatest(AUTHENTICATE, handleAuthentication);
}

export default function reducer(state: STATE = initState, action: any): STATE {
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
        case LOGOUT: {
            return {
                session_token: initState.session_token,
                name: initState.name,
                email: initState.email,
                authenticated: initState.authenticated,
            }
        }
        default:
            return state;
    }
}