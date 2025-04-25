// import { BlockRelation } from './../../pages/TwinnerUsers/BlockRelation';
import { blockRelationList } from './actions';
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
    limit: number;
}

interface ReportState {
    reports: Report[];
    loading: boolean;
    error: string | null;
    message: string | null;
    helpAndSupports: helpAndSupport[];
    pagination: PaginationData | null;
    block_relations: BlockRelation[];
}

const initialState: ReportState = {
    pagination: null,
    reports: [],
    loading: false,
    error: null,
    message: null,
    helpAndSupports: [],
    block_relations: [],
};

interface HelpSupportResponse {
    current_page: number;
    total_pages: number;
    limit: number;
    total_help_requests: number;
    help_requests: helpAndSupport[];
}

interface BlockRelationResponse {
    block_relations: BlockRelation[];
    current_page: number;
    total_pages: number;
    total_block_relations: number;
}

interface helpAndSupport {
    help_center_id: string;
    name: string;
    email: string; // ✅ Fixed from "emails" to "email"
    description: string;
    user_id: string;
    created_at: string;
}

interface BlockRelation {
    blocker_id: string;
    blocker_first_name: string;
    blocker_last_name: string;
    blocker_user_name: string;
    blocker_profile_image: string;
    blocked_id: string;
    blocked_first_name: string;
    blocked_last_name: string;
    blocked_user_name: string;
    blocked_profile_image: string;
    created_at: string;
    // block_relations: BlockRelationList[];
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
    | { type: typeof ReportActionTypes.SUPPORT_HELP_REVIEW_ERROR; payload: { error: string } }
    | {
          type: typeof ReportActionTypes.BLOCK_RELATIONS_PAGE;
      }
    | {
          type: typeof ReportActionTypes.BLOCK_RELATIONS_PAGE_SUCCESS;
          payload: BlockRelationResponse;
      }
    | {
          type: typeof ReportActionTypes.BLOCK_RELATIONS_PAGE_ERROR;
          payload: { error: string };
      };

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

                    limit: action.payload.data.limit,
                },
            };

        case ReportActionTypes.SUPPORT_HELP_LIST_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                message: null,
            };
        case ReportActionTypes.BLOCK_RELATIONS_PAGE:
            return {
                ...state,
                loading: true,
                error: null,
                message: null,
            };

        case ReportActionTypes.BLOCK_RELATIONS_PAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                block_relations: action.payload.block_relations,
            };

        case ReportActionTypes.BLOCK_RELATIONS_PAGE_ERROR:
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
