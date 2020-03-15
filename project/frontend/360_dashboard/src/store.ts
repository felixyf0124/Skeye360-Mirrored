import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers/rootReducer';
import rootSaga from './rootSaga';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: <T>(t?: T) => T;
  }
}

export const history = createBrowserHistory();

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['router'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer(history));

export default (): any => {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];
  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(...middleware),
      (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__())
        || compose,
    ),
  );
  sagaMiddleware.run(rootSaga);
  const persistor = persistStore(store);
  return { store, persistor };
};
