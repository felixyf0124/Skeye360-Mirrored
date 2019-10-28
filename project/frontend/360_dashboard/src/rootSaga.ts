import { fork } from 'redux-saga/effects';

import { saga as authentication } from './contexts/authentication';

export default function* rootSage(): IterableIterator<any> {
  yield fork(authentication);
}
