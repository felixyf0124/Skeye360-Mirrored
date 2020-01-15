import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import authentication, { STATE as authState } from '../contexts/authentication';
import logClick, { STATE as logState } from '../contexts/LogClicks';
import districts, { STATE as districtState } from '../contexts/districts';
import intersection, { STATE as intersectionState } from '../contexts/intersection';
import count, { STATE as countState } from '../contexts/vehicleCounts';
import camera, { STATE as cameraState } from '../contexts/camera';

export interface RootState {
  authentication: authState;
  logClick: logState;
  districts: districtState;
  intersection: intersectionState;
  count: countState;
  camera: cameraState;
  router: RouterState;
}

export default (history: History): any => combineReducers({
  authentication,
  logClick,
  districts,
  intersection,
  count,
  camera,
  router: connectRouter(history),
});
