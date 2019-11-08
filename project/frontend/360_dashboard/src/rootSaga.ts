import { fork } from 'redux-saga/effects';

import { saga as authentication } from './contexts/authentication';
import { saga as districts } from './contexts/districts';

export default function* rootSaga(): IterableIterator<any> {
  yield fork(authentication);
  yield fork(districts);
}
