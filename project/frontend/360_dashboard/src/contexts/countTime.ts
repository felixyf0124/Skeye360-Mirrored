import { call, put, takeLatest } from 'redux-saga/effects';
import countTime, { Response as CountResponse } from '../api/countTime';


export interface STATE {
    count: {
        count_type: any;
        count_direction: string;
        count: number;
        time: any;
        intersection_id: number;
    }
}

const initState: STATE = {
  count: {
    count_type: '',
    count_direction: '',
    count: 0,
    time: '',
    intersection_id: 0,
  }
};

export const GET_COUNT = 'GET_COUNT';
export const GET_COUNT_SUCCESS = 'GET_COUNT_SUCCESS';
export const GET_COUNT_FAIL = 'GET_COUNT_FAIL';

export interface GetCountAction { 
    type: string;
}

export const getCount = (): GetCountAction => ({
    type: GET_COUNT,
});

export interface GetCountSuccessAction {
    type: string;
    data: CountResponse;
  }
  // get district success case
  export const getCountSuccess = (data: CountResponse): GetCountSuccessAction => ({
    type: GET_COUNT_SUCCESS,
    data,
  });
  
  export interface GetCountFailAction {
    type: string;
  }
  
  // get district fail case
  export const getCountFail = (): GetCountFailAction => ({
    type: GET_COUNT_FAIL,
  });
  
  // SAGA
  export function* handleFetchCount(): Iterator<any> {
    try {
      const data = yield call(countTime);
      if (data !== undefined) {
        yield put(getCountSuccess(data));
      }
    } catch (e) {
      yield put(getCountFail());
      throw e;
    }
  }
  
  // saga action mapper
  export function* saga(): Iterator<any> {
    yield takeLatest(GET_COUNT, handleFetchCount);
  }
  
  // REDUCER
  export default function reducer(state: STATE = initState, action: any): STATE {
    switch (action.type) {
      case GET_COUNT_SUCCESS: {
        const { data } = action as GetCountSuccessAction;
        return {
          ...state,
          ...data,
        };
      }
      case GET_COUNT_FAIL: {
        return initState;
      }
      default:
        return state;
    }
  }
  