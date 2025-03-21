// import { interestList } from './actions';
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

import { APICore, setAuthorization } from '../../helpers/api/apiCore';

import { interestList, interestAdd, interestUpdate, interestDelete } from '../../helpers/api/auth';

import {
    interestListSuccess,
    interestListError,
    interestAddSuccess,
    interestAddError,
    interestUpdateSuccess,
    interestUpdateError,
    interestDeleteSuccess,
    interestDeleteError,
} from './actions';

import { IntAndHobActionTypes } from './constants';

function* interestListSaga(action: any): SagaIterator {
    try {
        const response = yield call(interestList, action.payload);
        yield put(interestListSuccess(response.data));
    } catch (error: any) {
        yield put(interestListError(error.message || 'Error Occured'));
    }
}

function* interestAddSaga(action: any): SagaIterator {
    try {
        const response = yield call(interestAdd, action.payload);
        yield put(interestAddSuccess(response.data.message));
    } catch (error: any) {
        yield put(interestAddError(error.message || 'Error Occured'));
    }
}

function* interestUpdateSaga(action: any): SagaIterator {
    try {
        const response = yield call(interestUpdate, action.payload);
        yield put(interestUpdateSuccess(response.data.message));
    } catch (error: any) {
        yield put(interestUpdateError(error.message || 'Error Occured'));
    }
}

function* interestDeleteSaga(action: any): SagaIterator {
    try {
        const response = yield call(interestDelete, action.payload);
        yield put(interestDeleteSuccess(response.data.message));
    } catch (error: any) {
        yield put(interestDeleteError(error.message || 'Error Occured'));
    }
}

function* watchInterestList() {
    yield takeEvery(IntAndHobActionTypes.INTERESTS_LIST, interestListSaga);
}

function* watchInterestAdd() {
    yield takeEvery(IntAndHobActionTypes.INTERESTS_ADD, interestAddSaga);
}

function* watchInterestUpdate() {
    yield takeEvery(IntAndHobActionTypes.INTERESTS_UPDATE, interestUpdateSaga);
}

function* watchInterestDelete() {
    yield takeEvery(IntAndHobActionTypes.INTERESTS_DELETE, interestDeleteSaga);
}

export default function* IndAndHobSaga() {
    yield all([fork(watchInterestList), fork(watchInterestAdd), fork(watchInterestDelete), fork(watchInterestUpdate)]);
}
