import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';
import {
    permissionModuleAdd,
    permissionModuleDelete,
    permissionModuleList,
    permissionAdd,
    permissionAssign,
    permissionDelete,
    permissionList,
} from '../../helpers/api/auth';

import {
    permissionModuleAddSuccess,
    permissionModuleDeleteSuccess,
    permissionModuleListSuccess,
    permissionAddSuccess,
    permissionAssignSuccess,
    permissionDeleteSuccess,
    permissionListSuccess,
    permissionModuleAddError,
    permissionModuleDeleteError,
    permissionModuleListError,
    permissionAddError,
    permissionAssignError,
    permissionDeleteError,
    permissionListError,
} from './actions';

import { RolesAndRightsActionTypes } from './constants';

function* permissionModuleAddSaga(action: any): SagaIterator {
    try {
        const response = yield call(permissionModuleAdd, action.payload);
        yield put(permissionModuleAddSuccess(response.data));
    } catch (error: any) {
        yield put(permissionModuleAddError(error.message || 'Error Occurred'));
    }
}
function* permissionModuleListSaga(action: any): SagaIterator {
    try {
        const response = yield call(permissionModuleList, action.payload);
        yield put(permissionModuleListSuccess(response.data));
    } catch (error: any) {
        yield put(permissionModuleListError(error.message || 'Error Occurred'));
    }
}
function* permissionModuleDeleteSaga(action: any): SagaIterator {
    try {
        const response = yield call(permissionModuleDelete, action.payload);
        yield put(permissionModuleDeleteSuccess(response.data));
    } catch (error: any) {
        yield put(permissionModuleDeleteError(error.message || 'Error Occurred'));
    }
}

function* permissionDeleteSaga(action: any): SagaIterator {
    try {
        const response = yield call(permissionDelete, action.payload);
        yield put(permissionDeleteSuccess(response.data.data));
    } catch (error: any) {
        yield put(permissionDeleteError(error.message || 'Error Occurred'));
    }
}

function* permissionListSaga(action: any): SagaIterator {
    try {
        const response = yield call(permissionList, action.payload);
        yield put(permissionListSuccess(response.data.data));
        console.log('Response of permissionList: ', response.data.data);
    } catch (error: any) {
        yield put(permissionListError(error.message || 'Error Occurred'));
    }
}
function* permissionAddSaga(action: any): SagaIterator {
    try {
        const response = yield call(permissionAdd, action.payload);
        yield put(permissionAddSuccess(response.data));
    } catch (error: any) {
        yield put(permissionAddError(error.message || 'Error Occurred'));
    }
}
function* permissionAssignSaga(action: any): SagaIterator {
    try {
        const response = yield call(permissionAssign, action.payload);
        yield put(permissionAssignSuccess(response.data));
    } catch (error: any) {
        yield put(permissionAssignError(error.message || 'Error Occurred'));
    }
}

function* watchPermssionModuleAdd() {
    yield takeEvery(RolesAndRightsActionTypes.PERMISSION_MODULE_ADD, permissionModuleAddSaga);
}
function* watchPermssionModuleList() {
    yield takeEvery(RolesAndRightsActionTypes.PERMISSION_MODULE_LIST, permissionModuleListSaga);
}
function* watchPermssionModuleDelete() {
    yield takeEvery(RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE, permissionModuleDeleteSaga);
}
function* watchPermssionAdd() {
    yield takeEvery(RolesAndRightsActionTypes.PERMISSION_ADD, permissionAddSaga);
}
function* watchPermssionList() {
    yield takeEvery(RolesAndRightsActionTypes.PERMISSION_LIST, permissionListSaga);
}
function* watchPermssionDelete() {
    yield takeEvery(RolesAndRightsActionTypes.PERMISSION_DELETE, permissionDeleteSaga);
}
function* watchPermssionAssign() {
    yield takeEvery(RolesAndRightsActionTypes.PERMISSION_ASSIGN, permissionAssignSaga);
}

export default function* rolesAndRightsSaga(): SagaIterator {
    yield all([
        fork(watchPermssionModuleAdd),
        fork(watchPermssionModuleDelete),
        fork(watchPermssionModuleList),
        fork(watchPermssionAdd),
        fork(watchPermssionList),
        fork(watchPermssionDelete),
        fork(watchPermssionAssign),
    ]);
}
