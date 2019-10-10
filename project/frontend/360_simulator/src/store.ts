/*
 * src/store.js
 * No initialState
*/
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/rootReducer';
import rootSaga from './rootSaga';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <T>(t?: T) => T;
  }
}

export default async () => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const store = createStore(
    rootReducer,
    {},
    compose(
      applyMiddleware(...middleware),
      (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
        compose,
    ),
  );
  //sagaMiddleware.run(Scene);

  sagaMiddleware.run(rootSaga);
  return store;
}
