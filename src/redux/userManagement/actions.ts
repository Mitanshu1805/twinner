import { UserManagementActionTypes } from './constants';

type UserFilterPayload = {
    min_age: number | null;
    max_age: number | null;
    education: string | null;
    country: string | null;
    city: string | null;
    birthdate: string | null;
    interested_in: string | null;
    search: string | null;

    // pagination?: { page: number; limit: number };
};

type Interest = {
    interest_id: string | null;
    interest_name: string | null;
    interest_image: string | null;
};

type User = {
    user_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    dob: string;
    education: string;
    country: string;
    city: string;
    bio: string;
    gender: string;
    language: string | null;
    profile_image: string;
    images: string[];
    progress_status: string;
    is_active: boolean;
    interests: Interest[];
};

type UserManagementSuccessPayload = {
    success: boolean;
    message: string;
    data: {
        users: User[];
    };
};

export type UserManagementActionType =
    | {
          type: typeof UserManagementActionTypes.USER_LIST_WITH_FILTER;
          payload: UserFilterPayload;
      }
    | {
          type: typeof UserManagementActionTypes.USER_LIST_WITH_FILTER_SUCCESS;
          payload: { data: UserManagementSuccessPayload };
      }
    | {
          type: typeof UserManagementActionTypes.USER_LIST_WITH_FILTER_ERROR;
          payload: string; // Error message
      }
    | {
          type: typeof UserManagementActionTypes.USER_UPDATE_STATUS;
          payload: { user_id: string; is_active: boolean };
      }
    | {
          type: typeof UserManagementActionTypes.USER_UPDATE_STATUS_SUCCESS;
          payload: { message: string }; // Success message
      }
    | {
          type: typeof UserManagementActionTypes.USER_UPDATE_STATUS_ERROR;
          payload: string; // Error message
      }
    | {
          type: typeof UserManagementActionTypes.USER_DELETE;
          payload: { user_id: string };
      }
    | {
          type: typeof UserManagementActionTypes.USER_DELETE_SUCCESS;
          payload: { message: string }; // Success message
      }
    | {
          type: typeof UserManagementActionTypes.USER_DELETE_ERROR;
          payload: string; // Error message
      };

// Action Creators

// export const userListFilter = (payload: UserFilterPayload): UserManagementActionType => ({
//     type: UserManagementActionTypes.USER_LIST_WITH_FILTER,
//     payload,
// });
export const userListFilter = (
    data: UserFilterPayload = {
        min_age: null,
        max_age: null,
        education: null,
        country: null,
        city: null,
        birthdate: null,
        interested_in: null,
        search: null, // Added search functionality
    }, // ✅ Default values to match UserFilterPayload type
    currentPage: number,
    itemsPerPage: number
): {
    type: typeof UserManagementActionTypes.USER_LIST_WITH_FILTER;
    payload: UserFilterPayload;
    meta: { currentPage: number; itemsPerPage: number };
} => ({
    type: UserManagementActionTypes.USER_LIST_WITH_FILTER,
    payload: data, // ✅ Now it will always be a valid UserFilterPayload
    meta: { currentPage, itemsPerPage },
});

// export const userListFilter = (payload: UserFilterPayload, page: number, limit: number): UserManagementActionType => ({
//     type: UserManagementActionTypes.USER_LIST_WITH_FILTER,
//     payload: { ...payload, pagination: { page, limit } }, // ✅ Nested inside `pagination`
// });

export const userListFilterSuccess = (data: UserManagementSuccessPayload): UserManagementActionType => ({
    type: UserManagementActionTypes.USER_LIST_WITH_FILTER_SUCCESS,
    payload: { data },
});

export const userListFilterError = (error: string): UserManagementActionType => ({
    type: UserManagementActionTypes.USER_LIST_WITH_FILTER_ERROR,
    payload: error,
});

export const userUpdateStatus = (user_id: string, is_active: boolean): UserManagementActionType => ({
    type: UserManagementActionTypes.USER_UPDATE_STATUS,
    payload: { user_id, is_active },
});

export const userUpdateStatusSuccess = (payload: { message: string }): UserManagementActionType => ({
    type: UserManagementActionTypes.USER_UPDATE_STATUS_SUCCESS,
    payload,
});

export const userUpdateStatusError = (error: string): UserManagementActionType => ({
    type: UserManagementActionTypes.USER_UPDATE_STATUS_ERROR,
    payload: error,
});

export const userDelete = (payload: { user_id: string }): UserManagementActionType => ({
    type: UserManagementActionTypes.USER_DELETE,
    payload,
});

export const userDeleteSuccess = (payload: { message: string }): UserManagementActionType => ({
    type: UserManagementActionTypes.USER_DELETE_SUCCESS,
    payload,
});

export const userDeleteError = (error: string): UserManagementActionType => ({
    type: UserManagementActionTypes.USER_DELETE_ERROR,
    payload: error,
});
