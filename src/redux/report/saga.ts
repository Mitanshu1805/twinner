// import { reportList, reportReview } from './actions';
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

import { reportList, reportReview } from '../../helpers/api/auth';

import { reportListSuccess, reportListError, reportReviewSuccess, reportReviewError } from './actions';

import { ReportActionTypes } from './constants';

function* reportListSaga(action: any): SagaIterator {
    try {
        const response = yield call(reportList, action.payload);
        yield put(reportListSuccess(response.data));
    } catch (error: any) {
        yield put(reportListError(error.message || 'Error Occurred'));
    }
}

function* reportReviewSaga(action: any): SagaIterator {
    try {
        const response = yield call(reportReview, action.payload);
        yield put(reportReviewSuccess(response.data.message));
    } catch (error: any) {
        yield put(reportReviewError(error.message || 'Error Occurred'));
    }
}

function* watchReportList() {
    yield takeEvery(ReportActionTypes.REPORT_LIST, reportListSaga);
}

function* watchReportReview() {
    yield takeEvery(ReportActionTypes.REPORT_REVIEW, reportReviewSaga);
}

export default function* reportSaga() {
    yield all([fork(watchReportList), fork(watchReportReview)]);
}
