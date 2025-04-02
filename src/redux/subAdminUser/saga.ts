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
    setAdminUserId,
} from './actions';

import { SubAdminUserActionTypes } from './constants';

function* adminUserListSaga(action: any): SagaIterator {
    try {
        const data = action.payload; // ✅ This is correct
        const { currentPage, itemsPerPage } = action.meta; // ✅ Get from `meta`
        const response = yield call(adminUserList, data, currentPage, itemsPerPage);
        console.log('USER LIST RESPONSE:', response);
        yield put(adminUserListSuccess(response.data.data));
    } catch (error: any) {
        yield put(adminUserListError(error.message || 'Error Occured'));
    }
}

// function* adminUserAddSaga(action: any): SagaIterator {
//     try {
//         const response = yield call(adminUserAdd, action.payload);
//         console.log('response.data.admin_user_id >> ', response.data.data.admin_user_id);

//         // Store the newly added user's ID in localStorage
//         localStorage.setItem('adminUserId', response.data.data.admin_user_id);

//         // Dispatch success action
//         yield put(adminUserAddSuccess(response.data));
//     } catch (error: any) {
//         // Handle error and dispatch error action
//         yield put(adminUserAddError(error.message || 'Error Occured'));
//     }
// }
function* adminUserAddSaga(action: any): SagaIterator {
    try {
        const response = yield call(adminUserAdd, action.payload);
        const adminUserId = response.data.data.admin_user_id;

        localStorage.setItem('adminUserId', adminUserId);

        yield put(setAdminUserId(adminUserId));

        // Dispatch success action and update Redux store
        yield put(adminUserAddSuccess(response.data));

        // Store the newly added user's ID in localStorage
        console.log('New added adminUserId: >>>', adminUserId);

        // Optionally dispatch an action to update Redux state
        yield put({ type: 'SET_ADMIN_USER_ID', payload: adminUserId }); // You could create a reducer to handle this
    } catch (error: any) {
        // Handle error and dispatch error action
        yield put(adminUserAddError(error.message || 'Error Occurred'));
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

// function* watchAdminUserAddSuccess() {
//     yield takeEvery(SubAdminUserActionTypes.ADMIN_USERS_ADD_SUCCESS, function* (action: any) {
//         const { admin_user_id } = action.payload;
//         console.log('admin_user_id in Saga:', admin_user_id); // log for debugging
//         // Do something with admin_user_id if needed here (e.g., navigate or store in global state)
//     });
// }

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
        // fork(watchAdminUserAddSuccess),
    ]);
}
