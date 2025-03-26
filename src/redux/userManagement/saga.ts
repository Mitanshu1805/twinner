import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

import { userListFilter, userUpdateStatus } from '../../helpers/api/auth';

import { userListFilterSuccess, userListFilterError, userUpdateStatusSuccess, userUpdateStatusError } from './actions';

import { UserManagementActionTypes } from './constants';

function* userListFilterSaga(action: any): SagaIterator {
    try {
        const response = yield call(userListFilter, action.payload);
        yield put(userListFilterSuccess(response.data));
    } catch (error: any) {
        yield put(userListFilterError(error.message || 'Error Occurred'));
    }
}

function* userUpdateStatusSaga(action: any): SagaIterator {
    try {
        const response = yield call(userUpdateStatus, action.payload);
        yield put(userUpdateStatusSuccess(response.data));
    } catch (error: any) {
        yield put(userUpdateStatusError(error.message || 'Error Occurred'));
    }
}

function* watchUserListFilter() {
    yield takeEvery(UserManagementActionTypes.USER_LIST_WITH_FILTER, userListFilterSaga);
}

function* watchUserUpdateStatus() {
    yield takeEvery(UserManagementActionTypes.USER_UPDATE_STATUS, userUpdateStatusSaga);
}

export default function* userManagementSaga(): SagaIterator {
    yield all([fork(watchUserListFilter), fork(watchUserUpdateStatus)]);
}
