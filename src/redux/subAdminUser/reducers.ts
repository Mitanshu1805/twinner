import { SubAdminUserActionTypes } from './constants';

interface AdminUser {
    admin_user_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    is_active: boolean;
}

interface AdminUserAdd {
    first_name: string;
    last_name: string;
    user_name: string;
    phone_number: string;
}

interface AdminUserSuccessPayload {
    message: string;
    data: AdminUser[];
}

interface AdminUserAddSuccessPayload {
    data: AdminUserAdd;
    message: string;
}

interface AdminUserErrorPayload {
    error: string;
}

interface AdminUserState {
    adminUsers: AdminUser[];
    loading: boolean;
    error: string | null;
    message: string | null;
}

const initialState: AdminUserState = {
    adminUsers: [],
    loading: false,
    error: null,
    message: null,
};

type SubAdminUserActionType =
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_LIST }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_LIST_SUCCESS; payload: AdminUserSuccessPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_LIST_ERROR; payload: AdminUserErrorPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_ADD; payload: AdminUserAdd }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_ADD_SUCCESS; payload: AdminUserAddSuccessPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_ADD_ERROR; payload: AdminUserErrorPayload }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_DELETE; payload: { admin_user_id: string } }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_DELETE_SUCCESS; payload: { message: string } }
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
        case SubAdminUserActionTypes.ADMIN_USERS_LIST:
            return { ...state, loading: true, error: null, message: null };

        case SubAdminUserActionTypes.ADMIN_USERS_LIST_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                message: action.payload.message,
                adminUsers: action.payload.data,
            };

        case SubAdminUserActionTypes.ADMIN_USERS_LIST_ERROR:
            return { ...state, loading: false, error: action.payload.error, message: null };

        case SubAdminUserActionTypes.ADMIN_USERS_ADD:
            return { ...state, loading: true, error: null };

        case SubAdminUserActionTypes.ADMIN_USERS_ADD_SUCCESS:
            return { ...state, loading: false, message: action.payload.message };

        case SubAdminUserActionTypes.ADMIN_USERS_ADD_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        case SubAdminUserActionTypes.ADMIN_USERS_DELETE:
            return { ...state, loading: true, error: null };

        case SubAdminUserActionTypes.ADMIN_USERS_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                adminUsers: state.adminUsers.filter((user) => user.admin_user_id !== action.payload.message),
            };

        case SubAdminUserActionTypes.ADMIN_USERS_DELETE_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        case SubAdminUserActionTypes.ADMIN_USERS_EDIT:
            return { ...state, loading: true, error: null };

        case SubAdminUserActionTypes.ADMIN_USERS_EDIT_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                adminUsers: state.adminUsers.map((user) =>
                    user.admin_user_id === action.payload.data[0].admin_user_id ? action.payload.data[0] : user
                ),
            };

        case SubAdminUserActionTypes.ADMIN_USERS_EDIT_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        case SubAdminUserActionTypes.UPDATE_ADMIN_STATUS:
            return { ...state, loading: true, error: null };

        case SubAdminUserActionTypes.UPDATE_ADMIN_STATUS_SUCCESS:
            console.log('Current adminUsers state:', state.adminUsers);
            console.log('Is adminUsers an array?', Array.isArray(state.adminUsers));

            return {
                ...state,

                loading: false,
                message: action.payload.message,
                adminUsers: state.adminUsers.map((user) =>
                    user.admin_user_id === action.payload.data[0].admin_user_id
                        ? { ...user, is_active: action.payload.data[0].is_active }
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
