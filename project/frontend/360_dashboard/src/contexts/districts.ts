import {
  call,
  put,
  takeLatest,
} from 'redux-saga/effects';
import fetchDistricts, { Response as districtResponse } from '../api/fetchDistricts';

export interface STATE {
  district: {
    [district: string]: {
      id: number;
      district_name: string;
      intersections: {
        id: number;
        intersection_name: string;
        latitude: number;
        cameras: [];
        longitude: number;
        district_id: number;
      }[];
    };
  };
}

const initState: STATE = {
  district: {
    Downtown: {
      id: 1,
      // eslint-disable-next-line @typescript-eslint/camelcase
      district_name: 'Downtown',
      intersections: [],
    },
  },
};

export const GET_DISTRICTS = 'GET_DISTRICTS';
export const GET_DISTRICTS_SUCCESS = 'GET_DISTRICTS_SUCCESS';
export const GET_DISTRICTS_FAIL = 'GET_DISTRICTS_FAIL';

export interface GetDistrictsAction {
    type: string;
}

export const getDistricts = (): GetDistrictsAction => ({
  type: GET_DISTRICTS,
});

export interface GetDistrictsSuccessAction {
  type: string;
  data: districtResponse;
}

export const getDistrictsSuccess = (data: districtResponse): GetDistrictsSuccessAction => ({
  type: GET_DISTRICTS_SUCCESS,
  data,
});

export interface GetDistrictsFailAction {
  type: string;
}

export const getDistrictsFail = (): GetDistrictsFailAction => ({
  type: GET_DISTRICTS_FAIL,
});

// SAGA
export function* handleFetchDistricts(): Iterator<any> {
  try {
    const data = yield call(fetchDistricts);
    if (data !== undefined) {
      yield put(getDistrictsSuccess(data));
    }
  } catch (e) {
    yield put(getDistrictsFail());
    throw e;
  }
}

export function* saga(): Iterator<any> {
  yield takeLatest(GET_DISTRICTS, handleFetchDistricts);
}

export default function reducer(state: STATE = initState, action: any): STATE {
  switch (action.type) {
    case GET_DISTRICTS_SUCCESS: {
      const { data } = action as GetDistrictsSuccessAction;
      // console.log(action.type);
      return {
        ...state,
        district: data.district.reduce(
          (memo, district) => ({
            ...memo,
            [district.district_name]: district,
          }),
          {},
        ),
      };
    }
    case GET_DISTRICTS_FAIL: {
      return initState;
    }
    default:
      return state;
  }
}
