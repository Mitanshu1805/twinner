import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

import { versionList, versionUpdate } from '../../helpers/api/auth';

import { versionListSuccess, versionListError, versionUpdateSuccess, versionUpdateError } from './actions';

import { VersionActionTypes } from './constants';

// VERSION LIST SAGA
function* versionListSaga(): SagaIterator {
    try {
        const response = yield call(versionList);
        console.log('app updates saga >>>', response);

        yield put(versionListSuccess(response.data));
    } catch (error: any) {
        yield put(versionListError(error.message || 'Error Occurred'));
    }
}

// VERSION UPDATE SAGA
function* versionUpdateSaga(action: any): SagaIterator {
    try {
        const response = yield call(versionUpdate, action.payload.data);
        yield put(versionUpdateSuccess(response.data.message));
    } catch (error: any) {
        yield put(versionUpdateError(error.message || 'Update failed'));
    }
}

// WATCHERS
function* watchVersionList(): SagaIterator {
    yield takeEvery(VersionActionTypes.VERSION_LIST, versionListSaga);
}

function* watchVersionUpdate(): SagaIterator {
    yield takeEvery(VersionActionTypes.VERSION_UPDATE, versionUpdateSaga);
}

// ROOT SAGA
export default function* versionSaga(): SagaIterator {
    yield all([fork(watchVersionList), fork(watchVersionUpdate)]);
}
