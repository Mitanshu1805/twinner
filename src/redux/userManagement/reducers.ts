import { UserManagementActionTypes } from './constants';
// import { UserManagementActionType } from './actions';

interface UserManagementFilterPayload {
    min_age: number | null;
    max_age: number | null;
    education: string | null;
    country: string | null;
    city: string | null;
    birthdate: string | null;
    interested_in: string | null;
}

interface UserType {
    user_id: number | string;
    name: string;
    email: string;
    age: number;
    education: string;
    country: string;
    city: string;
    birthdate: string;
    interested_in: string;
    is_active: boolean;
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
    | {
        type: typeof UserManagementActionTypes.USER_UPDATE_STATUS_SUCCESS;
        payload: { user_id: string; message: string };
    } // Include `user_id`
    | { type: typeof UserManagementActionTypes.USER_UPDATE_STATUS_ERROR; payload: string }
    | { type: typeof UserManagementActionTypes.USER_DELETE; payload: { user_id: string } }
    | { type: typeof UserManagementActionTypes.USER_DELETE_SUCCESS; payload: { message: string; user_id: string } }
    | { type: typeof UserManagementActionTypes.USER_DELETE_ERROR; payload: string };

const userReducer = (state = initialState, action: UserManagementActionType): UserState => {
    switch (action.type) {
        case UserManagementActionTypes.USER_LIST_WITH_FILTER:
            return { ...state, loading: true, error: null };

        // case UserManagementActionTypes.USER_LIST_WITH_FILTER_SUCCESS:
        //     console.log('Reducer received USER_LIST_WITH_FILTER_SUCCESS with payload:', action.payload);

        //     const usersArray = Array.isArray(action.payload?.data) ? action.payload.data : action.payload?.data?.users;

        //     console.log('Users Array in Reducer:', usersArray);

        //     return {
        //         ...state,
        //         loading: false,
        //         users:
        //             usersArray?.map((user) => ({
        //                 user_id: user.user_id ? Number(user.user_id) || user.user_id : null,
        //                 name: `${user.first_name} ${user.last_name}`,
        //                 email: user.user_name,
        //                 age: user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 0,
        //                 education: user.education,
        //                 country: user.country,
        //                 city: user.city,
        //                 birthdate: user.dob,
        //                 interested_in:
        //                     user.interests?.map((i: { interest_name: string }) => i.interest_name).join(', ') || '',
        //                 is_active: user.is_active,
        //             })) || [],
        //     };
        case UserManagementActionTypes.USER_LIST_WITH_FILTER_SUCCESS:
            console.log('Reducer received USER_LIST_WITH_FILTER_SUCCESS with payload:', action.payload);

            const usersArray = action.payload?.data?.users || [];
            console.log('Users Array in Reducer:', usersArray);

            return {
                ...state,
                loading: false,
                users: [...state.users, ...usersArray.map((user) => ({
                    user_id: user.user_id,
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.user_name,
                    age: user.dob ? new Date().getFullYear() - new Date(user.dob).getFullYear() : 0,
                    education: user.education,
                    country: user.country,
                    city: user.city,
                    birthdate: user.dob,
                    interested_in: user.interests?.map((i) => i.interest_name).join(', ') || '',
                    is_active: user.is_active,
                }))],
            };


        case UserManagementActionTypes.USER_LIST_WITH_FILTER_ERROR:
            return { ...state, loading: false, error: action.payload };

        case UserManagementActionTypes.USER_UPDATE_STATUS:
            return { ...state, loading: true, error: null };

        case UserManagementActionTypes.USER_UPDATE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.map((user) =>
                    user.user_id.toString() === action.payload.user_id
                        ? { ...user, is_active: !user.is_active } // Toggle status
                        : user
                ),
            };

        case UserManagementActionTypes.USER_UPDATE_STATUS_ERROR:
            return { ...state, loading: false, error: action.payload };

        case UserManagementActionTypes.USER_DELETE:
            return { ...state, loading: true, error: null };

        case UserManagementActionTypes.USER_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.filter((user) => user.user_id.toString() !== action.payload.user_id),
            };

        case UserManagementActionTypes.USER_DELETE_ERROR:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default userReducer;
