import { combineReducers } from 'redux';
import authentication, { STATE as authState } from '../contexts/authentication';

export interface RootState {
  authentication: authState;
}

export default combineReducers({
  authentication,
});
