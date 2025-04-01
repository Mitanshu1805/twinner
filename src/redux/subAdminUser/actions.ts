import { Message } from './../../pages/dashboards/DashBoard1/types';
import { SubAdminUserActionTypes } from './constants';

type AdminUser = {
    admin_user_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    is_active: boolean;
};

type AdminUserAdd = {
    // admin_user_id: string;
    first_name: string;
    last_name: string;
    // user_name: string;
    phone_number: string;
};

type UpdateAdminStatus = {
    admin_user_id: string;
    is_active: boolean;
};

export type SubAdminUserActionType =
    | {
        type: typeof SubAdminUserActionTypes.ADMIN_USERS_LIST;
    }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_LIST_SUCCESS; payload: { data: AdminUser[] } }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_LIST_ERROR; payload: { error: string } }
    | {
        type: typeof SubAdminUserActionTypes.ADMIN_USERS_ADD;
        payload: AdminUserAdd;
    }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_ADD_SUCCESS; payload: { message: string } }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_ADD_ERROR; payload: { error: string } }
    | {
        type: typeof SubAdminUserActionTypes.ADMIN_USERS_DELETE;
        payload: { admin_user_id: string };
    }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_DELETE_SUCCESS; payload: { message: string } }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_DELETE_ERROR; payload: { error: string } }
    | {
        type: typeof SubAdminUserActionTypes.ADMIN_USERS_EDIT;
        payload: AdminUserAdd;
    }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_EDIT_SUCCESS; payload: { message: string } }
    | { type: typeof SubAdminUserActionTypes.ADMIN_USERS_EDIT_ERROR; payload: { error: string } }
    | {
        type: typeof SubAdminUserActionTypes.UPDATE_ADMIN_STATUS;
        payload: UpdateAdminStatus;
    }
    | { type: typeof SubAdminUserActionTypes.UPDATE_ADMIN_STATUS_SUCCESS; payload: { message: string } }
    | { type: typeof SubAdminUserActionTypes.UPDATE_ADMIN_STATUS_ERROR; payload: { error: string } };

export const adminUserList = (): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_LIST,
});

export const adminUserListSuccess = (data: AdminUser[]): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_LIST_SUCCESS,
    payload: { data },
});

export const adminUserListError = (error: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_LIST_ERROR,
    payload: { error },
});

export const adminUserAdd = (data: AdminUserAdd): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_ADD,
    payload: data,
});

export const adminUserAddSuccess = (message: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_ADD_SUCCESS,
    payload: { message },
});

export const adminUserAddError = (error: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_ADD_ERROR,
    payload: { error },
});

export const adminUserDelete = (admin_user_id: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_DELETE,
    payload: { admin_user_id },
});

export const adminUserDeleteSuccess = (message: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_DELETE_SUCCESS,
    payload: { message },
});

export const adminUserDeleteError = (error: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_DELETE_ERROR,
    payload: { error },
});

export const adminUserUpdate = (data: AdminUserAdd): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_EDIT,
    payload: data,
});

export const adminUserUpdateSuccess = (message: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_EDIT_SUCCESS,
    payload: { message },
});

export const adminUserUpdateError = (error: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.ADMIN_USERS_EDIT_ERROR,
    payload: { error },
});

export const updateAdminStatus = (admin_user_id: string, is_active: boolean): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.UPDATE_ADMIN_STATUS,
    payload: { admin_user_id, is_active },
});

export const updateAdminStatusSuccess = (message: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.UPDATE_ADMIN_STATUS_SUCCESS,
    payload: { message },
});

export const updateAdminStatusError = (error: string): SubAdminUserActionType => ({
    type: SubAdminUserActionTypes.UPDATE_ADMIN_STATUS_ERROR,
    payload: { error },
});
