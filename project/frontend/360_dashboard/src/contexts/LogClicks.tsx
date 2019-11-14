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

export const ADD_LOG_CLICK = 'ADD_LOG_CLICK';
export const ADD_LOG_SUCCESS = 'ADD_LOG_SUCCESS';
export const ADD_LOG_FAIL = 'ADD_LOG_FAIL';

export interface LogAction extends Action {
    log_message: string;
    user_id: number;
}

export const logClick = (
  log_message: string,
  user_id: number,
): LogAction => ({
  type: ADD_LOG_CLICK,
  log_message,
  user_id,
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
  log_message,
  user_id,
}: LogAction): Iterator<any> {
  try {
    const data = yield call(logClicks, log_message, user_id);
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
