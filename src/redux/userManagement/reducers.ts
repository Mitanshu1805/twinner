import { UserManagementActionTypes } from './constants';
// import { UserManagementActionType } from './actions';

interface UserManagementFilterPayload {
    min_age: number;
    max_age: number;
    education: string;
    country: string;
    city: string;
    birthdate: string;
    interested_in: string;
}

interface UserType {
    id: number;
    name: string;
    email: string;
    age: number;
    education: string;
    country: string;
    city: string;
    birthdate: string;
    interested_in: string;
}

type UserState = {
    users: UserType[];
    loading: boolean;
    error: string | null;
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

const initialState: UserState = {
    users: [],
    loading: false,
    error: null,
};

type UserManagementActionType =
    | { type: typeof UserManagementActionTypes.USER_LIST_WITH_FILTER; payload: UserManagementFilterPayload }
    | { type: typeof UserManagementActionTypes.USER_LIST_WITH_FILTER_SUCCESS; payload: UserManagementSuccessPayload }
    | { type: typeof UserManagementActionTypes.USER_LIST_WITH_FILTER_ERROR; payload: string }
    | { type: typeof UserManagementActionTypes.USER_UPDATE_STATUS; payload: { user_id: string; is_active: boolean } }
    | { type: typeof UserManagementActionTypes.USER_UPDATE_STATUS_SUCCESS; payload: { message: string } }
    | { type: typeof UserManagementActionTypes.USER_UPDATE_STATUS_ERROR; payload: string };

const userReducer = (state = initialState, action: UserManagementActionType): UserState => {
    switch (action.type) {
        case UserManagementActionTypes.USER_LIST_WITH_FILTER:
            return { ...state, loading: true, error: null };

        // case UserManagementActionTypes.USER_LIST_WITH_FILTER_SUCCESS:
        //     return { ...state, loading: false, users: action.payload?.data?.users || [] };

        case UserManagementActionTypes.USER_LIST_WITH_FILTER_ERROR:
            return { ...state, loading: false, error: action.payload };

        case UserManagementActionTypes.USER_UPDATE_STATUS:
            return { ...state, loading: true, error: null };

        case UserManagementActionTypes.USER_UPDATE_STATUS_SUCCESS:
            return { ...state, loading: false };

        case UserManagementActionTypes.USER_UPDATE_STATUS_ERROR:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}; // **Closing the function properly**

export default userReducer;
