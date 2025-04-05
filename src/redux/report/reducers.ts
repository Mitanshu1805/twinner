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

interface SupportHelpReview {
    help_center_id: string;
    response: string;
}

interface ReportListSuccessPayload {
    message: string;
    data: Report[];
}

interface PaginationData {
    current_page: number;
    total_pages: number;
}

interface ReportState {
    reports: Report[];
    loading: boolean;
    error: string | null;
    message: string | null;
    helpAndSupports: helpAndSupport[];
    pagination: PaginationData | null;
}

const initialState: ReportState = {
    pagination: null,
    reports: [],
    loading: false,
    error: null,
    message: null,
    helpAndSupports: [],
};

interface HelpSupportResponse {
    current_page: number;
    total_pages: number;
    total_help_requests: number;
    help_requests: helpAndSupport[];
}

interface helpAndSupport {
    help_center_id: string;
    name: string;
    email: string; // ✅ Fixed from "emails" to "email"
    description: string;
    user_id: string;
    created_at: string;
}

type ReportActionType =
    | { type: typeof ReportActionTypes.REPORT_LIST }
    | { type: typeof ReportActionTypes.REPORT_LIST_SUCCESS; payload: ReportListSuccessPayload }
    | { type: typeof ReportActionTypes.REPORT_LIST_ERROR; payload: { error: string } }
    | { type: typeof ReportActionTypes.REPORT_REVIEW; payload: ReportReview }
    | { type: typeof ReportActionTypes.REPORT_REVIEW_SUCCESS; payload: { message: string } }
    | { type: typeof ReportActionTypes.REPORT_REVIEW_ERROR; payload: { error: string } }
    | { type: typeof ReportActionTypes.SUPPORT_HELP_LIST }
    | {
          type: typeof ReportActionTypes.SUPPORT_HELP_LIST_SUCCESS;
          payload: { data: HelpSupportResponse; message: string }; // ✅ Fixed from `HelpSupportResponse[]` to `HelpSupportResponse`
      }
    | { type: typeof ReportActionTypes.SUPPORT_HELP_LIST_ERROR; payload: { error: string } }
    | { type: typeof ReportActionTypes.SUPPORT_HELP_REVIEW; payload: SupportHelpReview }
    | { type: typeof ReportActionTypes.SUPPORT_HELP_REVIEW_SUCCESS; payload: { message: string } }
    | { type: typeof ReportActionTypes.SUPPORT_HELP_REVIEW_ERROR; payload: { error: string } };

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
        case ReportActionTypes.SUPPORT_HELP_REVIEW: // ✅ Added
            return {
                ...state,
                loading: true,
                error: null,
            };

        case ReportActionTypes.REPORT_REVIEW_SUCCESS:
        case ReportActionTypes.SUPPORT_HELP_REVIEW_SUCCESS: // ✅ Added
            return {
                ...state,
                loading: false,
                message: action.payload.message,
            };

        case ReportActionTypes.REPORT_REVIEW_ERROR:
        case ReportActionTypes.SUPPORT_HELP_REVIEW_ERROR: // ✅ Added
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case ReportActionTypes.SUPPORT_HELP_LIST:
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
            };

        case ReportActionTypes.SUPPORT_HELP_LIST_SUCCESS:
            console.log('Reducer received SUPPORT_HELP_LIST_SUCCESS:', action.payload.data);
            return {
                ...state,
                loading: false,
                error: null,
                message: action.payload.message,
                helpAndSupports: action.payload.data.help_requests,
                pagination: {
                    total_pages: action.payload.data.total_pages,
                    current_page: action.payload.data.current_page,
                    // limit: action.payload.data.limit,
                },
            };

        case ReportActionTypes.SUPPORT_HELP_LIST_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                message: null,
            };

        default:
            return state;
    }
};

export default reportReducer;
