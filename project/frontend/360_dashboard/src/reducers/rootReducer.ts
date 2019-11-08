import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import authentication, { STATE as authState } from '../contexts/authentication';
import districts, { STATE as districtState } from '../contexts/districts';

export interface RootState {
  authentication: authState;
  districts: districtState;
  router: RouterState;
}

export default (history: History): any => combineReducers({
  authentication,
  districts,
  router: connectRouter(history),
});
