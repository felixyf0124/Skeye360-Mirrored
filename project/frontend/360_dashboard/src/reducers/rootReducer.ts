import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import authentication, { STATE as authState } from '../contexts/authentication';
import logClick, {STATE as logState } from '../contexts/LogClicks';
import districts, { STATE as districtState } from '../contexts/districts';
import intersection, { STATE as intersectionState } from '../contexts/intersection';

export interface RootState {
  authentication: authState;
  districts: districtState;
  intersection: intersectionState;
  router: RouterState;
  logClick: logState;
}

export default (history: History): any => combineReducers({
  authentication,
  logClick,
  districts,
  intersection,
  router: connectRouter(history),
});
