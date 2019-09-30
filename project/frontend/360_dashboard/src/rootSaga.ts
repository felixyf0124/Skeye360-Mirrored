import { fork } from 'redux-saga/effects';

import { saga as hello } from './contexts/hello';

export default function* rootSage(): IterableIterator<any> {
  yield fork(hello);
}
