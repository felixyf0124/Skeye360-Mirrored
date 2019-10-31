import {
    call,
    put,
    takeLatest,
} from 'redux-saga/effects';
import authenticateUser, { Response as authResponse } from '../api/authenticateUser';
import { Redirect } from 'react-router';

export interface STATE {
    session_token: string;
    username: string;
    timestamp: string;
    authenticated: boolean;
    error: string;
}

const initState: STATE = {
    session_token: "",
    username: "",
    timestamp: "",
    authenticated: false,
    error: "",
}

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
    type: AUTHENTICATE,
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

interface authFailAction {
    type: string;
}

export const authFail = (): authFailAction => ({
    type: AUTHENTICATE_FAIL,
});

// SAGA
export function* handleAuthentication({ username, password }: AuthAction): Iterator<any> {
    try {
        console.log("handleAuthentication" + username + password);
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
                session_token: 'TEST',
                username: action.name,
                authenticated: true,
            }
        }
        case AUTHENTICATE_SUCCESS: {
            const { data } = action as AuthSuccessAction;
            console.log(action.type);
            return {
                ...state,
                session_token: data.token,
                username: data.username,
                timestamp: data.timestamp,
                authenticated: true,
            };
        }
        case AUTHENTICATE_FAIL: {
            return {
                session_token: initState.session_token,
                username: initState.username,
                timestamp: initState.timestamp,
                authenticated: initState.authenticated,
                error: 'Invalid credentials.',
            }
        }
        case LOGOUT: {
            return {
                session_token: initState.session_token,
                username: initState.username,
                timestamp: initState.timestamp,
                authenticated: initState.authenticated,
                error: initState.error,
            }
        }
        default:
            return state;
    }
}