import { fork } from 'redux-saga/effects';

import { saga as authentication } from './contexts/authentication';
import { saga as streetview } from './contexts/streetview';

export default function* rootSage(): IterableIterator<any> {
  yield fork(authentication);
  yield fork(streetview);
}
