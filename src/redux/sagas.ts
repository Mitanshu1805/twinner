import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import IndAndHobSaga from './interestAndHobbies/saga';

export default function* rootSaga() {
    yield all([authSaga(), layoutSaga(), IndAndHobSaga()]);
}
