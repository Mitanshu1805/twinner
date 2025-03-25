import { ReportActionTypes } from './constants';

type Report = {
    report_id: string;
    reported_user: {
        user_id: string;
        first_name: string;
        last_name: string;
        user_name: string;
        phone_number: string;
        country: string;
        city: string;
        profile_image: File;
        dob: string;
    };
    reporter_user: {
        user_id: string;
        first_name: string;
        last_name: string;
        user_name: string;
        phone_number: string;
        country: string;
        city: string;
        profile_image: File;
        dob: string;
    };
    description: string;
    created_at: string;
};

type ReportReview = {
    report_id: string;
};

export type ReportActionType =
    | {
          type: ReportActionTypes.REPORT_LIST;
      }
    | {
          type: ReportActionTypes.REPORT_LIST_SUCCESS;
          payload: { data: Report[] };
      }
    | {
          type: ReportActionTypes.REPORT_LIST_ERROR;
          payload: { error: string };
      }
    | {
          type: ReportActionTypes.REPORT_REVIEW;
          payload: ReportReview;
      }
    | {
          type: ReportActionTypes.REPORT_REVIEW_SUCCESS;
          payload: { message: string };
      }
    | {
          type: ReportActionTypes.REPORT_REVIEW_ERROR;
          payload: { error: string };
      };

export const reportList = (): ReportActionType => ({
    type: ReportActionTypes.REPORT_LIST,
});

export const reportListSuccess = (data: Report[]): ReportActionType => ({
    type: ReportActionTypes.REPORT_LIST_SUCCESS,
    payload: { data },
});

export const reportListError = (error: string): ReportActionType => ({
    type: ReportActionTypes.REPORT_LIST_ERROR,
    payload: { error },
});

export const reportReview = (report: ReportReview): ReportActionType => ({
    type: ReportActionTypes.REPORT_REVIEW,
    payload: report,
});

export const reportReviewSuccess = (message: string): ReportActionType => ({
    type: ReportActionTypes.REPORT_REVIEW_SUCCESS,
    payload: { message },
});

export const reportReviewError = (error: string): ReportActionType => ({
    type: ReportActionTypes.REPORT_REVIEW_ERROR,
    payload: { error },
});
