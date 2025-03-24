import { all } from 'redux-saga/effects';

import authSaga from './auth/saga';
import layoutSaga from './layout/saga';
import IndAndHobSaga from './interestAndHobbies/saga';
import reportSaga from './report/saga';
import subAdminUsersSaga from './subAdminUser/saga';

export default function* rootSaga() {
    yield all([authSaga(), layoutSaga(), IndAndHobSaga(), reportSaga(), subAdminUsersSaga()]);
}
