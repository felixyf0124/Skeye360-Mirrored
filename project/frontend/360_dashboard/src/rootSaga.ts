import { fork } from 'redux-saga/effects';

import { saga as authentication } from './contexts/authentication';
import { saga as districts } from './contexts/districts';
import { saga as intersection } from './contexts/intersection';
import { saga as logging } from './contexts/LogClicks';
import { saga as count } from './contexts/vehicleCounts';
import { saga as camera } from './contexts/camera';

export default function* rootSaga(): IterableIterator<any> {
  yield fork(authentication);
  yield fork(districts);
  yield fork(intersection);
  yield fork(logging);
  yield fork(count);
  yield fork(camera);
}
