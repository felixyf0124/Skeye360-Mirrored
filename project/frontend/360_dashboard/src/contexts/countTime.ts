import { Action } from 'redux';
import { call, put, takeLatest } from 'redux-saga/effects';
import { 
  Response as CountResponse, 
  getCountMA 
} from '../api/countTime';
export interface STATE {
  count_type: string;
  count_direction: string;
  count: number;
  time: any;
  intersection_id: number;
}

const initState: STATE = {
  count_type: '',
  count_direction: '',
  count: 0,
  time: '',
  intersection_id: 0,
};

export const GET_COUNT_MA = 'GET_COUNT_MA';
export const GET_COUNT_MA_SUCCESS = 'GET_COUNT_MA_SUCCESS';
export const GET_COUNT_MA_FAIL = 'GET_COUNT_MA_FAIL';


export interface GetCountMAvgAction extends Action {
  type: string,
  id: string,
}

export const getCountMAvg = (id: string): GetCountMAvgAction => ({
  type: GET_COUNT_MA,
  id,
});

export interface GetCountMAvgSuccessAction {
  type: string;
  data: CountResponse;
}

export const getCountMAvgSuccess = (data: CountResponse): GetCountMAvgSuccessAction => ({
  type: GET_COUNT_MA_SUCCESS,
  data,
})

export interface GetCountMAvgFailAction {
  type: string;
}
export const getCountMAvgFail = (): GetCountMAvgFailAction => ({
  type: GET_COUNT_MA_FAIL,
})

// SAGA
//This is where the get request gets made, by calling yield call(getCountMA)
export function* handleFetchMACount({ id }: GetCountMAvgAction): Iterator<any> {
  try {
    const data = yield call(getCountMA, id);
    if (data !== undefined) {
      yield put(getCountMAvgSuccess(data));
    }
  } catch (e) {
    yield put(getCountMAvgFail());
    throw e;
  }
}

// saga action mapper
export function* saga(): Iterator<any> {
  yield takeLatest(GET_COUNT_MA, handleFetchMACount);
}

// REDUCER
export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case GET_COUNT_MA_SUCCESS: {
      const { data } = action as GetCountMAvgSuccessAction;
      return {
        ...state,
        ...data,
      };
    }
    case GET_COUNT_MA_FAIL: {
      return {
        ...state
      }
    }
    default:
      return state;
  }
}