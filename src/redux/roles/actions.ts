import { RolesAndRightsActionTypes } from './constants';

type ModuleListSuccessPayload = {
    module_id: string;
    module_name: string;
    created_at: string;
    updated_at: string;
};

type PermissionListSuccessPayload = {
    module_name: string;
    permissions: Permissions[];
};

type Permissions = {
    permission_id: string;
    permission_type: string;
};

type PermissionAssignPayload = {
    admin_user_id: string;
    permission_ids: string[];
    // assigned_by: string;
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

export type RolesAndRightsActionType =
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_ADD;
          payload: { module_name: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_ADD_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_ADD_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_LIST;
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_LIST_SUCCESS;
          payload: ModuleListSuccessPayload[];
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_LIST_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE;
          payload: { module_id: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_ADD;
          payload: {
              module_id: string;
              permission_type: string;
          };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_ADD_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_ADD_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_LIST;
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_LIST_SUCCESS;
          payload: PermissionListSuccessPayload;
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_LIST_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_DELETE;
          payload: {
              permission_id: string;
          };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_DELETE_SUCCESS;
          payload: { message: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_DELETE_ERROR;
          payload: { error: string };
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_ASSIGN;
          payload: PermissionAssignPayload;
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_ASSIGN_SUCCESS;
          payload: PermissionAssignSuccessPayload;
      }
    | {
          type: typeof RolesAndRightsActionTypes.PERMISSION_ASSIGN_ERROR;
          payload: { error: string };
      };

export const permissionModuleAdd = (module_name: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_MODULE_ADD,
    payload: { module_name },
});

export const permissionModuleAddSuccess = (message: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_MODULE_ADD_SUCCESS,
    payload: { message },
});

export const permissionModuleAddError = (error: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_MODULE_ADD_ERROR,
    payload: { error },
});

export const permissionModuleList = (): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_MODULE_LIST,
});

export const permissionModuleListSuccess = (modules: ModuleListSuccessPayload[]): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_MODULE_LIST_SUCCESS,
    payload: modules, // ✅ Correct, directly passing the array
});

export const permissionModuleListError = (error: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_MODULE_LIST_ERROR,
    payload: { error },
});

export const permissionModuleDelete = (module_id: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE,
    payload: { module_id },
});

export const permissionModuleDeleteSuccess = (message: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE_SUCCESS,
    payload: { message },
});

export const permissionModuleDeleteError = (error: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_MODULE_DELETE_ERROR,
    payload: { error },
});

export const permissionAssign = (payload: PermissionAssignPayload): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_ASSIGN,
    payload,
});

export const permissionAssignSuccess = (data: PermissionAssignSuccessPayload): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_ASSIGN_SUCCESS,
    payload: data,
});

export const permissionAssignError = (error: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_ASSIGN_ERROR,
    payload: { error },
});

export const permissionAdd = (module_id: string, permission_type: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_ADD,
    payload: { module_id, permission_type },
});

export const permissionAddSuccess = (message: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_ADD_SUCCESS,
    payload: { message },
});

export const permissionAddError = (error: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_ADD_ERROR,
    payload: { error },
});

export const permissionList = (): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_LIST,
    // payload: { module_id, permission_type },
});

export const permissionListSuccess = (data: PermissionListSuccessPayload): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_LIST_SUCCESS,
    payload: data,
});

export const permissionListError = (error: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_LIST_ERROR,
    payload: { error },
});

export const permissionDelete = (permission_id: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_DELETE,
    payload: { permission_id },
});

export const permissionDeleteSuccess = (message: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_DELETE_SUCCESS,
    payload: { message },
});

export const permissionDeleteError = (error: string): RolesAndRightsActionType => ({
    type: RolesAndRightsActionTypes.PERMISSION_DELETE_ERROR,
    payload: { error },
});
