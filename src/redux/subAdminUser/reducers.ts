import { SubAdminUserActionTypes } from './constants';
import { SetAdminUserIdAction } from './actions';

interface AdminUser {
    admin_user_id: string;
    first_name: string;
    last_name: string;
    // user_name: string;
    is_active: boolean;
}

interface SubAdminUserState {
    admin_user_id: string;
    // Other state properties...
}

interface AdminUserAdd {
    first_name: string;
    last_name: string;
    // user_name: string;
    phone_number: string;
}

interface PaginationData {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
}

interface AdminUserSuccessPayload {
    message: string;
    data: {
        pagination: {
            totalRecords: number;
            currentPage: number;
            totalPages: number;
            pageSize: number;
        };
        users: AdminUser[]; // ✅ Corrected, now matches API response
    };
}

interface AdminUserAddSuccessPayload {
    first_name: string;
    last_name: string;
    user_name: string;
    phone_number: string;
    message: string;
    admin_user_id: string;
}

interface AdminUserErrorPayload {
    error: string;
}

interface AdminUserState {
    adminUsers: AdminUser[];
    loading: boolean;
    error: string | null;
    message: string | null;
    success: boolean;
    admin_user_id: string | null;
    pagination: PaginationData | null;
}

const initialState: AdminUserState = {
    pagination: null,
    adminUsers: [],
    loading: false,
    error: null,
    message: null,
    success: false,

    // admin_user_id: null,
    admin_user_id: localStorage.getItem('adminUserId') || '',
};

type SubAdminUserActionType =
    | {
          type: typeof SubAdminUserActionTypes.SET_ADMIN_USER_ID;
          payload: string;
      }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_LIST }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_LIST_SUCCESS; payload: AdminUserSuccessPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_LIST_ERROR; payload: AdminUserErrorPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_ADD; payload: AdminUserAdd }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_ADD_SUCCESS; payload: AdminUserAddSuccessPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_ADD_ERROR; payload: AdminUserErrorPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_DELETE; payload: { admin_user_id: string } }
    | {
          type: typeof SubAdminUserActionTypes.ADMIN_USERS_DELETE_SUCCESS;
          payload: { message: string; admin_user_id: string };
      }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_DELETE_ERROR; payload: AdminUserErrorPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_EDIT; payload: AdminUser }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_EDIT_SUCCESS; payload: AdminUserSuccessPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_EDIT_ERROR; payload: AdminUserErrorPayload }
    | {
          type: typeof SubAdminUserActionTypes.UPDATE_ADMIN_STATUS;
          payload: { admin_user_id: string; is_active: boolean };
      }
    | { type: typeof SubAdminUserActionTypes.UPDATE_ADMIN_STATUS_SUCCESS; payload: AdminUserSuccessPayload }
    | { type: typeof SubAdminUserActionTypes.UPDATE_ADMIN_STATUS_ERROR; payload: AdminUserErrorPayload };

const adminUserReducer = (state: AdminUserState = initialState, action: SubAdminUserActionType): AdminUserState => {
    switch (action.type) {
        case SubAdminUserActionTypes.SET_ADMIN_USER_ID:
            return { ...state, admin_user_id: action.payload };

        case SubAdminUserActionTypes.ADMIN_USERS_LIST:
            return { ...state, loading: true, error: null, message: null };

        case SubAdminUserActionTypes.ADMIN_USERS_LIST_SUCCESS:
            console.log('API Response Data:', action.payload.data);
            return {
                ...state,
                loading: false,
                error: null,
                message: action.payload.message,
                adminUsers: Array.isArray(action.payload?.data?.users) ? action.payload?.data?.users : [],
                pagination: action.payload.data.pagination, // ✅ Fixes type error
            };

        case SubAdminUserActionTypes.ADMIN_USERS_LIST_ERROR:
            return { ...state, loading: false, error: action.payload.error, message: null };

        case SubAdminUserActionTypes.ADMIN_USERS_ADD:
            return { ...state, loading: true, error: null, success: false };

        // Handle success when a new admin user is added
        // case SubAdminUserActionTypes.ADMIN_USERS_ADD_SUCCESS:
        //     // Save the newly created user ID (you can store it in the state if you want to access it later)
        //     const { admin_user_id, message } = action.payload;
        //     return {
        //         ...state,
        //         loading: false,
        //         message,
        //         admin_user_id, // Store the admin user ID
        //     };

        case SubAdminUserActionTypes.ADMIN_USERS_ADD_SUCCESS:
            // Assuming action.payload contains the admin_user_id
            const newAdminUser = {
                admin_user_id: action.payload.admin_user_id,
                first_name: action.payload.first_name,
                last_name: action.payload.last_name,
                phone_number: action.payload.phone_number,
                is_active: true, // Default to active
            };

            return {
                ...state,
                loading: false,
                success: true,
                error: null,
                admin_user_id: action.payload.admin_user_id,
                adminUsers: [...state.adminUsers, newAdminUser], // Add the new user to the list
            };

        case SubAdminUserActionTypes.ADMIN_USERS_ADD_ERROR:
            return { ...state, loading: false, error: action.payload.error, success: false };

        case SubAdminUserActionTypes.ADMIN_USERS_DELETE:
            return { ...state, loading: true, error: null };

        case SubAdminUserActionTypes.ADMIN_USERS_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                adminUsers: state.adminUsers.filter((user) => user.admin_user_id !== action.payload.admin_user_id),
            };

        case SubAdminUserActionTypes.ADMIN_USERS_DELETE_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        case SubAdminUserActionTypes.ADMIN_USERS_EDIT:
            return { ...state, loading: true, error: null, success: false };

        case SubAdminUserActionTypes.ADMIN_USERS_EDIT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                error: null,
                message: action.payload.message,
                adminUsers: state.adminUsers.map((user) =>
                    user.admin_user_id === action.payload?.data?.users[0].admin_user_id
                        ? action.payload?.data?.users[0]
                        : user
                ),
            };

        case SubAdminUserActionTypes.ADMIN_USERS_EDIT_ERROR:
            return { ...state, loading: false, error: action.payload.error, success: false };

        case SubAdminUserActionTypes.UPDATE_ADMIN_STATUS:
            return { ...state, loading: true, error: null };

        case SubAdminUserActionTypes.UPDATE_ADMIN_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                adminUsers: state.adminUsers.map((user) =>
                    user.admin_user_id === action.payload?.data?.users[0].admin_user_id
                        ? { ...user, is_active: action.payload?.data?.users[0].is_active }
                        : user
                ),
            };

        case SubAdminUserActionTypes.UPDATE_ADMIN_STATUS_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        default:
            return state;
    }
};

export default adminUserReducer;
