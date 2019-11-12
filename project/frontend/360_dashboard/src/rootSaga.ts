import { fork } from 'redux-saga/effects';

import { saga as authentication } from './contexts/authentication';
import { saga as districts } from './contexts/districts';
import { saga as intersection } from './contexts/intersection';
import { saga as logging } from './contexts/LogClicks';

export default function* rootSaga(): IterableIterator<any> {
  yield fork(authentication);
  yield fork(districts);
  yield fork(intersection);
  yield fork(logging);
}
