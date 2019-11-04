/*
 * src/store.js
 * No initialState
*/
import {
  createStore, applyMiddleware, compose, Store,
} from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import initReducers from './reducers/rootReducer';
import rootSaga from './rootSaga';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <T>(t?: T) => T;
  }
}

export const history = createBrowserHistory();

export default async (): Promise<Store> => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const store = createStore(
    initReducers(history),
    {},
    compose(
      applyMiddleware(...middleware),
      (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__())
        || compose,
    ),
  );
  sagaMiddleware.run(rootSaga);
  return store;
};
