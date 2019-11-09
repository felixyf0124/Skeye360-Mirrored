import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import authentication, { STATE as authState } from '../contexts/authentication';
import logClick, {STATE as logState } from '../contexts/LogClicks';


export interface RootState {
  authentication: authState;
  router: RouterState;
  logClick: logState;
}

export default (history: History): any => combineReducers({
  authentication,
  logClick,
  router: connectRouter(history),
});
