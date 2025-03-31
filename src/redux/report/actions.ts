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

type helpAndSupport = {
    help_center_id: string;
    name: string;
    emails: string;
    description: string;
    user_id: string;
    created_at: string;
};

export type ReportActionType =
    | {
          type: ReportActionTypes.REPORT_LIST;
          payload: { page: number; limit: number };
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
      }
    | {
          type: ReportActionTypes.SUPPORT_HELP_LIST;
      }
    | {
          type: ReportActionTypes.SUPPORT_HELP_LIST_SUCCESS;
          payload: { data: helpAndSupport };
      }
    | {
          type: ReportActionTypes.SUPPORT_HELP_LIST_ERROR;
          payload: { error: string };
      };

export const reportList = (page: number, limit: number): ReportActionType => ({
    type: ReportActionTypes.REPORT_LIST,
    payload: { page, limit },
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

// export const supportHelpList = (page: number,
//     limit: number): ReportActionType => ({
//         type: ReportActionTypes.SUPPORT_HELP_LIST,

//     });

export const supportHelpList = (page: number, limit: number) => ({
    type: ReportActionTypes.SUPPORT_HELP_LIST,
    payload: { page, limit }, // ✅ Ensure page & limit are passed correctly
});

export const supportHelpListSuccess = (data: helpAndSupport): ReportActionType => ({
    type: ReportActionTypes.SUPPORT_HELP_LIST_SUCCESS,
    payload: { data },
});

export const supportHelpListError = (error: string): ReportActionType => ({
    type: ReportActionTypes.SUPPORT_HELP_LIST_ERROR,
    payload: { error },
});
