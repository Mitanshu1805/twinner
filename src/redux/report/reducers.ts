import { ReportActionTypes } from './constants';

interface Report {
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
}

interface ReportReview {
    report_id: string;
}

interface ReportListSuccessPayload {
    message: string;
    data: Report[];
}

interface ReportState {
    reports: Report[];
    loading: boolean;
    error: string | null;
    message: string | null;
}

const initialState: ReportState = {
    reports: [],
    loading: false,
    error: null,
    message: null,
};

type ReportActionType =
    | { type: typeof ReportActionTypes.REPORT_LIST }
    | { type: typeof ReportActionTypes.REPORT_LIST_SUCCESS; payload: ReportListSuccessPayload }
    | { type: typeof ReportActionTypes.REPORT_LIST_ERROR; payload: { error: string } }
    | { type: typeof ReportActionTypes.REPORT_REVIEW; payload: ReportReview }
    | { type: typeof ReportActionTypes.REPORT_REVIEW_SUCCESS; payload: { message: string } }
    | { type: typeof ReportActionTypes.REPORT_REVIEW_ERROR; payload: { error: string } };

const reportReducer = (state: ReportState = initialState, action: ReportActionType): ReportState => {
    switch (action.type) {
        case ReportActionTypes.REPORT_LIST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
            };

        case ReportActionTypes.REPORT_LIST_SUCCESS:
            return {
                ...state,
                reports: action.payload.data,
                loading: false,
                error: null,
                message: action.payload.message,
            };

        case ReportActionTypes.REPORT_LIST_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                message: null,
            };

        case ReportActionTypes.REPORT_REVIEW:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case ReportActionTypes.REPORT_REVIEW_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
            };

        case ReportActionTypes.REPORT_REVIEW_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        default:
            return state;
    }
};

export default reportReducer;
