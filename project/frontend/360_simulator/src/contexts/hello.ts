import {
    call,
    put,
    takeLatest,
  } from 'redux-saga/effects';
import fetchHelloWorld, { HelloResponse } from '../api/fetchHelloWorld';

interface Hello {
    hello: string;
}

export interface STATE {
    hello: string;
}

const initState: STATE = {
    hello: "asd",
}

export const selectHello = (state: any): Hello => state.hello;

const GET_HELLO = 'GET_HELLO';
export const GET_HELLO_SUCCESS = 'GET_HELLO_SUCCESS';
export const GET_HELLO_FAIL = 'GET_HELLO_FAIL';

export interface GetHelloAction {
    type: string;
}

export const getHello = (): GetHelloAction => ({
    type: GET_HELLO,
});

interface GetHelloSuccessAction {
    type: string;
    data: HelloResponse['hello'];
}
export const getHelloSuccess = (
    data: HelloResponse['hello'],
): GetHelloSuccessAction => ({
    type: GET_HELLO_SUCCESS,
    data,
});

interface GetHelloFailAction {
    type: string;
}

export const getHelloFail = (): GetHelloFailAction => ({
    type: GET_HELLO_FAIL,
});

// SAGA
export function* handleFetchHello(): Iterator<any> {
    try {
      const APIDomain = '172.17.0.3:8000';
      console.log("handleFetchHello");
      const data = yield call(fetchHelloWorld, APIDomain);
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
    // console.log("SAGA");
    yield takeLatest(GET_HELLO, handleFetchHello);
}

export default function reducer(state: STATE = initState, action: any): any {
    // console.log("REDUCER");
    switch (action.type) {
        case GET_HELLO_SUCCESS: {
            const { data } = action as GetHelloSuccessAction;
            console.log(action.type);
            return {
                ...state,
                hello: data,
            };
        }
        default:
            return state;
    }
}