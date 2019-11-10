/* eslint-disable @typescript-eslint/camelcase */
import { Action } from 'redux';
import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import logClicks, { Response as logResponse } from '../api/logClicks';

export interface STATE {
  error: string;
}

const initState: STATE = {
  error: '',
};

export const ADD_LOG_CLICK = 'ADD_LOG';
export const ADD_LOG_SUCCESS = 'ADD_LOG_SUCCESS';
export const ADD_LOG_FAIL = 'ADD_LOG_FAIL';

export interface LogAction extends Action {
    username: string,
    log_message: string,
}

export const logClick = (
  username: string,
  log_message: string,
): LogAction => ({
  type: ADD_LOG_CLICK,
  username,
  log_message,
});

export interface LogSuccessAction {
  type: string;
  data: logResponse;
}

export const LogSuccess = (
  data: logResponse,
): LogSuccessAction => ({
  type: ADD_LOG_SUCCESS,
  data,
});

export interface LogFail {
  type: string;
}

export const LogFail = (): LogFail => ({
  type: ADD_LOG_FAIL,
});

// SAGA
export function* handleAddLog({
  username,
  log_message,
}: LogAction): Iterator<any> {
  try {
    const data = yield call(logClicks, username, log_message);
    if (data !== undefined) {
      yield put(LogSuccess(data));
    }
  } catch (e) {
    yield put(LogFail());
    throw e;
  }
}

export function* saga(): Iterator<any> {
  yield takeLatest(ADD_LOG_CLICK, handleAddLog);
}

export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case ADD_LOG_SUCCESS: {
      return {
        ...state,
        error: 'Saved Log!',
      };
    }
    case ADD_LOG_FAIL: {
      return {
        ...state,
        error: 'Error while saving log.',
      };
    }
    default:
      return state;
  }
}
