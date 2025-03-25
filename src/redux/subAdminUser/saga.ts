import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

import { APICore, setAuthorization } from '../../helpers/api/apiCore';

import {
    adminUserList,
    adminUserAdd,
    adminUserDelete,
    adminUserUpdate,
    updateAdminStatus,
} from '../../helpers/api/auth';

import {
    adminUserListSuccess,
    adminUserListError,
    adminUserAddSuccess,
    adminUserAddError,
    adminUserDeleteSuccess,
    adminUserDeleteError,
    adminUserUpdateSuccess,
    adminUserUpdateError,
    updateAdminStatusSuccess,
    updateAdminStatusError,
} from './actions';

import { SubAdminUserActionTypes } from './constants';

function* adminUserListSaga(action: any): SagaIterator {
    try {
        const response = yield call(adminUserList, action.payload);
        yield put(adminUserListSuccess(response.data));
    } catch (error: any) {
        yield put(adminUserListError(error.message || 'Error Occured'));
    }
}

function* adminUserAddSaga(action: any): SagaIterator {
    try {
        const response = yield call(adminUserAdd, action.payload);
        yield put(adminUserAddSuccess(response.data));
    } catch (error: any) {
        yield put(adminUserAddError(error.message || 'Error Occured'));
    }
}

function* adminUserDeleteSaga(action: any): SagaIterator {
    try {
        const response = yield call(adminUserDelete, action.payload);
        yield put(adminUserDeleteSuccess(response.data));
    } catch (error: any) {
        yield put(adminUserDeleteError(error.message || 'Error Occured'));
    }
}

function* adminUserUpdateSaga(action: any): SagaIterator {
    try {
        const response = yield call(adminUserUpdate, action.payload);
        yield put(adminUserUpdateSuccess(response.data));
    } catch (error: any) {
        yield put(adminUserUpdateError(error.message || 'Error Occured'));
    }
}

function* updateAdminStatusSaga(action: any): SagaIterator {
    try {
        const response = yield call(updateAdminStatus, action.payload);
        yield put(updateAdminStatusSuccess(response.data));
    } catch (error: any) {
        yield put(updateAdminStatusError(error.message || 'Error Occured'));
    }
}

function* watchAdminUserList() {
    yield takeEvery(SubAdminUserActionTypes.ADMIN_USERS_LIST, adminUserListSaga);
}

function* watchAdminUserAdd() {
    yield takeEvery(SubAdminUserActionTypes.ADMIN_USERS_ADD, adminUserAddSaga);
}

function* watchAdminUserDelete() {
    yield takeEvery(SubAdminUserActionTypes.ADMIN_USERS_DELETE, adminUserDeleteSaga);
}

function* watchAdminUserUpdate() {
    yield takeEvery(SubAdminUserActionTypes.ADMIN_USERS_EDIT, adminUserUpdateSaga);
}

function* watchUpdateAdminStatus() {
    yield takeEvery(SubAdminUserActionTypes.UPDATE_ADMIN_STATUS, updateAdminStatusSaga);
}

export default function* subAdminUsersSaga(): SagaIterator {
    yield all([
        fork(watchAdminUserList),
        fork(watchAdminUserAdd),
        fork(watchAdminUserDelete),
        fork(watchAdminUserUpdate),
        fork(watchUpdateAdminStatus),
    ]);
}
