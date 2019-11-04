import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import authentication, { STATE as authState } from '../contexts/authentication';

export interface RootState {
  authentication: authState;
  router: RouterState;
}

export default (history: History) => combineReducers({
  authentication,
  router: connectRouter(history),
});
