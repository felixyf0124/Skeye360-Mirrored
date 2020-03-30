import { fork } from 'redux-saga/effects';

import { saga as authentication } from './contexts/authentication';
import { saga as districts } from './contexts/districts';
import { saga as intersection } from './contexts/intersection';
import { saga as logging } from './contexts/LogClicks';
import { saga as count } from './contexts/vehicleCounts';
import { saga as camera } from './contexts/camera';
import { saga as traffic } from './contexts/traffic';
import { saga as users } from './contexts/users';
import { saga as register } from './contexts/register';
import { saga as profile } from './contexts/profile';

// RootSaga (Alphabetical Order)
export default function* rootSaga(): IterableIterator<any> {
  yield fork(authentication);
  yield fork(camera);
  yield fork(count);
  yield fork(districts);
  yield fork(intersection);
  yield fork(logging);
  yield fork(profile);
  yield fork(register);
  yield fork(traffic);
  yield fork(users);
}
