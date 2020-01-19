import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import authentication, { STATE as authState } from '../contexts/authentication';
import logClick, { STATE as logState } from '../contexts/LogClicks';
import districts, { STATE as districtState } from '../contexts/districts';
import intersection, { STATE as intersectionState } from '../contexts/intersection';
import countTime, {STATE as countTimeState } from '../contexts/countTime';

export interface RootState {
  authentication: authState;
  logClick: logState;
  districts: districtState;
  intersection: intersectionState;
  router: RouterState;
  countTime: countTimeState;
}

export default (history: History): any => combineReducers({
  authentication,
  logClick,
  districts,
  intersection,
  countTime,
  router: connectRouter(history),
});
