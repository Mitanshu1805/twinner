import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

import { userListFilter, userUpdateStatus, userDelete } from '../../helpers/api/auth';

import {
    userListFilterSuccess,
    userListFilterError,
    userUpdateStatusSuccess,
    userUpdateStatusError,
    userDeleteSuccess,
    userDeleteError,
} from './actions';

import { UserManagementActionTypes } from './constants';

function* userListFilterSaga(action: any): SagaIterator {
    try {
        const response = yield call(userListFilter, action.payload);
        console.log('Full API response:', response);

        const users = response.data.data.users; // Ensure correct path
        console.log('Extracted Users from response:', users);

        yield put(userListFilterSuccess(users));
    } catch (error: any) {
        console.error('Error in userListFilterSaga:', error);
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

function* userDeleteSaga(action: any): SagaIterator {
    try {
        const response = yield call(userDelete, action.payload);
        yield put(userDeleteSuccess(response.data));
    } catch (error: any) {
        yield put(userDeleteError(error.message || 'Error Occurred'));
    }
}

function* watchUserListFilter() {
    yield takeEvery(UserManagementActionTypes.USER_LIST_WITH_FILTER, userListFilterSaga);
}

function* watchUserUpdateStatus() {
    yield takeEvery(UserManagementActionTypes.USER_UPDATE_STATUS, userUpdateStatusSaga);
}

function* watchUserDelete() {
    yield takeEvery(UserManagementActionTypes.USER_DELETE, userDeleteSaga);
}

export default function* userManagementSaga(): SagaIterator {
    yield all([fork(watchUserListFilter), fork(watchUserUpdateStatus), fork(watchUserDelete)]);
}
