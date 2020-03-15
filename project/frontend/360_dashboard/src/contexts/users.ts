/* eslint-disable @typescript-eslint/camelcase */
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchOperators, Response as usersResponse } from '../api/fetchUsers';

export interface STATE {
  [index: number]: {
    id: number;
    username: string;
    is_staff: boolean;
  }[];
}

// initState
const initState: STATE = {
  0: [{ id: 1, username: 'admin', is_staff: false }],
};

// actions
export const GET_USERS = 'GET_USERS';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAIL = 'GET_USERS_FAIL';

export interface GetUsersAction {
  type: string;
}

// get users base case
export const getUsers = (): GetUsersAction => ({
  type: GET_USERS,
});

export interface GetUsersSuccessAction {
  type: string;
  data: usersResponse;
}

// get users success case
export const getUsersSuccess = (data: usersResponse): GetUsersSuccessAction => ({
  type: GET_USERS_SUCCESS,
  data,
});

export interface GetUsersFailAction {
  type: string;
}

// get users fail case
export const getUsersFail = (): GetUsersFailAction => ({
  type: GET_USERS_FAIL,
});

// SAGA
export function* handleFetchUsers(): Iterator<any> {
  try {
    const data = yield call(fetchOperators);
    if (data !== undefined) {
      yield put(getUsersSuccess(data));
    }
  } catch (e) {
    yield put(getUsersFail());
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(GET_USERS, handleFetchUsers);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case GET_USERS_SUCCESS: {
      const { data } = action as GetUsersSuccessAction;
      return {
        ...state,
        ...data,
      };
    }
    case GET_USERS_FAIL: {
      return {
        ...state,
      };
    }
    default:
      return state;
  }
}
