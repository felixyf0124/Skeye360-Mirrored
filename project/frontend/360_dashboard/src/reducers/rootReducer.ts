import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import authentication, { STATE as authState } from '../contexts/authentication';
import logClick, { STATE as logState } from '../contexts/LogClicks';
import districts, { STATE as districtState } from '../contexts/districts';
import intersection, { STATE as intersectionState } from '../contexts/intersection';
import count, { STATE as countState } from '../contexts/vehicleCounts';
import camera, { STATE as cameraState } from '../contexts/camera';
import traffic, { STATE as trafficState } from '../contexts/traffic';
import users, { STATE as userState } from '../contexts/users';

// RootReducer (Alphabetical Order)
export interface RootState {
  authentication: authState;
  camera: cameraState;
  count: countState;
  districts: districtState;
  intersection: intersectionState;
  logClick: logState;
  router: RouterState;
  traffic: trafficState;
  users: userState;
}

export default (history: History): any => combineReducers({
  authentication,
  camera,
  count,
  districts,
  intersection,
  logClick,
  router: connectRouter(history),
  traffic,
  users,
});
