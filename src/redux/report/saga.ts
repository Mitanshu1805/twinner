// import { reportList, reportReview } from './actions';
import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

import { reportList, reportReview, supportHelpList } from '../../helpers/api/auth';

import {
    reportListSuccess,
    reportListError,
    reportReviewSuccess,
    reportReviewError,
    supportHelpListSuccess,
    supportHelpListError,
} from './actions';

import { ReportActionTypes } from './constants';

function* reportListSaga(action: any): SagaIterator {
    try {
        const { page, limit } = action.payload;
        const response = yield call(reportList, page, limit);
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

function* supportHelpListSaga(action: any): SagaIterator {
    try {
        const { page, limit } = action.payload; // ✅ Extract from payload
        const response = yield call(supportHelpList, page, limit); // ✅ Pass empty object for data

        console.log('Help List Response', response);
        yield put(supportHelpListSuccess(response.data.data));
    } catch (error: any) {
        yield put(supportHelpListError(error.message || 'Error Occurred'));
    }
}

function* watchReportList() {
    yield takeEvery(ReportActionTypes.REPORT_LIST, reportListSaga);
}

function* watchReportReview() {
    yield takeEvery(ReportActionTypes.REPORT_REVIEW, reportReviewSaga);
}

function* watchSupportHelpList() {
    yield takeEvery(ReportActionTypes.SUPPORT_HELP_LIST, supportHelpListSaga);
}

export default function* reportSaga() {
    yield all([fork(watchReportList), fork(watchReportReview), fork(watchSupportHelpList)]);
}
