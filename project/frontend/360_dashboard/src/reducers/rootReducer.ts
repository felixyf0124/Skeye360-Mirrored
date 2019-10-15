import { combineReducers } from 'redux';
import authentication, { STATE as authState } from '../contexts/authentication';
import streetview, { STATE as streetviewState } from '../contexts/streetview';

export interface RootState {
  authentication: authState;
  streetview: streetviewState;
}

export default combineReducers({
  authentication,
  streetview,
});
