import { combineReducers } from 'redux';
import simpleReducer from './simpleReducer';
import hello, { STATE as helloState } from '../contexts/hello';

export interface RootState {
  hello: helloState;
}

export default combineReducers({
  simpleReducer,
  hello,
});
