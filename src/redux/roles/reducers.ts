import { RolesAndRightsActionTypes } from './constants';

interface ModuleListSuccessPayload {
    module_id: string;
    module_name: string;
    created_at: string;
    updated_at: string;
}

interface PermissionListSuccessPayload {
    module_name: string;
    permissions: Permissions[];
}

interface Permissions {
    permission_id: string;
    permission_type: string;
}

type PermissionAssignPayload = {
    admin_user_id: string;
    permission_ids: string[];
    assigned_by: string;
};

type PermissionAssignSuccessPayload = {
    success: boolean;
    message: string;
    data: {
        assignedPermissions: {
            permission_id: string;
        }[];
    };
};

interface RolesAndRightsState {
    modules: ModuleListSuccessPayload[];
    permissions: PermissionListSuccessPayload[]; // ✅ Should store an array of modules
    assignedPermissions: { permission_id: string }[];
    loading: boolean;
    error: string | null;
}

const initialState: RolesAndRightsState = {
    modules: [],
    permissions: [],
    assignedPermissions: [],
    loading: false,
    error: null,
};

type RolesAndRightsActionType =
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_ADD; payload: { module_name: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_ADD_SUCCESS; payload: { message: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_ADD_ERROR; payload: { error: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_LIST }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_LIST_SUCCESS; payload: ModuleListSuccessPayload[] }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_LIST_ERROR; payload: { error: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE; payload: { module_id: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE_SUCCESS; payload: { message: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE_ERROR; payload: { error: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_LIST }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_LIST_SUCCESS; payload: PermissionListSuccessPayload[] }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_LIST_ERROR; payload: { error: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_ADD; payload: { module_id: string; permission_type: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_ADD_SUCCESS; payload: { message: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_ADD_ERROR; payload: { error: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_DELETE; payload: { permission_id: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_DELETE_SUCCESS; payload: { message: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_DELETE_ERROR; payload: { error: string } }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_ASSIGN; payload: PermissionAssignPayload }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_ASSIGN_SUCCESS; payload: PermissionAssignSuccessPayload }
    | { type: typeof RolesAndRightsActionTypes.PERMISSION_ASSIGN_ERROR; payload: { error: string } };

const rolesAndRightsReducer = (state = initialState, action: RolesAndRightsActionType): RolesAndRightsState => {
    switch (action.type) {
        case RolesAndRightsActionTypes.PERMISSION_MODULE_ADD:
        case RolesAndRightsActionTypes.PERMISSION_MODULE_LIST:
        case RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE:
        case RolesAndRightsActionTypes.PERMISSION_LIST:
        case RolesAndRightsActionTypes.PERMISSION_ADD:
        case RolesAndRightsActionTypes.PERMISSION_DELETE:
        case RolesAndRightsActionTypes.PERMISSION_ASSIGN:
            return { ...state, loading: true, error: null };

        case RolesAndRightsActionTypes.PERMISSION_MODULE_ADD_SUCCESS:
        case RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE_SUCCESS:
        case RolesAndRightsActionTypes.PERMISSION_ADD_SUCCESS:
        case RolesAndRightsActionTypes.PERMISSION_DELETE_SUCCESS:
            return { ...state, loading: false, error: null };

        case RolesAndRightsActionTypes.PERMISSION_MODULE_LIST_SUCCESS:
            return { ...state, loading: false, modules: action.payload, error: null };

        case RolesAndRightsActionTypes.PERMISSION_LIST_SUCCESS:
            console.log('Received permissions:', action.payload); // ✅ Debugging Log
            return {
                ...state,
                loading: false,
                permissions: action.payload,
                error: null,
            };

        case RolesAndRightsActionTypes.PERMISSION_ASSIGN_SUCCESS:
            return {
                ...state,
                loading: false,
                assignedPermissions: action.payload.data.assignedPermissions,
                error: null,
            };

        case RolesAndRightsActionTypes.PERMISSION_MODULE_ADD_ERROR:
        case RolesAndRightsActionTypes.PERMISSION_MODULE_LIST_ERROR:
        case RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE_ERROR:
        case RolesAndRightsActionTypes.PERMISSION_LIST_ERROR:
        case RolesAndRightsActionTypes.PERMISSION_ADD_ERROR:
        case RolesAndRightsActionTypes.PERMISSION_DELETE_ERROR:
        case RolesAndRightsActionTypes.PERMISSION_ASSIGN_ERROR:
            return { ...state, loading: false, error: action.payload.error };

        default:
            return state;
    }
};

export default rolesAndRightsReducer;
