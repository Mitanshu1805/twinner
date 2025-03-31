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

// function* userListFilterSaga(action: any): SagaIterator {
//     try {
//         const { payload, params } = action;
//         const { page, limit } = params;

//         // ✅ Convert page and limit to query string
//         const queryParams = new URLSearchParams({
//             page: page.toString(),
//             limit: limit.toString(),
//         }).toString();

//         // ✅ API call: Pass arguments separately
//         const response = yield call(userListFilter, payload, page, limit);

//         console.log('Full API response of Twinner Users:', response);

//         if (!response || !response.data.data) {
//             throw new Error('No users found for such filter');
//         }

//         const users = response.data.data.users;
//         console.log('Extracted Users from response:', users);

//         yield put(userListFilterSuccess(users));
//     } catch (error: any) {
//         console.error('Error in userListFilterSaga:', error);
//         yield put(userListFilterError(error.message || 'Error Occurred'));
//     }
// }

// function* userListFilterSaga(action: any): SagaIterator {
//     try {
//         const response = yield call(userListFilter, action.payload);
//         console.log('Full API response of Twinner Users:', response);

//         // Handle 404 response properly
//         if (response?.status === 404 || !response?.data) {
//             console.warn('No users found, setting empty list');

//             yield put(userListFilterSuccess({
//                 success: true,  // Assuming the API response structure
//                 message: "No users found",
//                 data: { users: [] }  // Ensure correct data structure
//             }));

//             return;
//         }

//         // Ensure response structure is valid before accessing properties
//         const users = response.data?.data?.users || [];

//         console.log('Extracted Users from response:', users);

//         yield put(userListFilterSuccess({
//             success: true,
//             message: "Users retrieved successfully",
//             data: { users }
//         }));
//     } catch (error: any) {
//         console.error('Error in userListFilterSaga:', error);

//         // Handle error response more gracefully
//         if (error.response?.status === 404) {
//             yield put(userListFilterSuccess({
//                 success: false,
//                 message: "No users found",
//                 data: { users: [] }
//             }));
//         } else {
//             yield put(userListFilterError(error.message || 'Error Occurred'));
//         }
//     }
// }

// function* userListFilterSaga(action: any): SagaIterator {
//     try {
//         const response = yield call(userListFilter, action.payload);
//         yield put(userListFilterSuccess(response.data.data));
//     } catch (error: any) {
//         console.error('Error in userListFilterSaga:', error);
//         yield put(userListFilterError(error.message || 'Error Occurred'));
//     }
// }
function* userListFilterSaga(action: any): SagaIterator {
    try {
        console.log("🔥 Saga Received Action:", action);

        const data = action.payload; // ✅ This is correct
        const { currentPage, itemsPerPage } = action.meta; // ✅ Get from `meta`

        console.log("📌 Extracted Filter Payload:", data);
        console.log("📌 Extracted Pagination:", { currentPage, itemsPerPage });

        // Call the API function that already appends `page` and `limit` to the URL
        console.log("📤 Sending request with:", action.payload, action.meta);
        const response = yield call(userListFilter, data, currentPage, itemsPerPage);
        console.log("📥 API Response:", response.data);
        console.log("📌 Users in API response:", response.data?.data?.users);


        yield put(userListFilterSuccess(response.data.data));
    } catch (error: any) {
        console.error("Error in userListFilterSaga:", error);
        yield put(userListFilterError(error.message || "Error Occurred"));
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
