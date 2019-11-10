import { fork } from 'redux-saga/effects';

import { saga as authentication } from './contexts/authentication';

import { saga as logging } from './contexts/LogClicks';

export default function* rootSaga(): IterableIterator<any> {
  yield fork(authentication);
  yield fork(logging);
}
