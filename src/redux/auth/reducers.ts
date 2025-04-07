// apicore
import { APICore } from '../../helpers/api/apiCore';

// constants
import { AuthActionTypes } from './constants';

const api = new APICore();

const INIT_STATE = {
    user: api.getLoggedInUser(),
    token: api.getLoggedInUser()?.token || null,
    permissions: [],
    loading: false,
};

type UserData = {
    id: number;
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
    token: string;
    permissions?: { module_name: string; permissions: string[] }[]; // Permissions from API
};

type AuthActionType = {
    type:
        | AuthActionTypes.SEND_OTP
        | AuthActionTypes.VERIFY_OTP
        | AuthActionTypes.API_RESPONSE_SUCCESS
        | AuthActionTypes.API_RESPONSE_ERROR
        | AuthActionTypes.LOGIN_USER
        | AuthActionTypes.SIGNUP_USER
        | AuthActionTypes.LOGOUT_USER
        | AuthActionTypes.RESET;
    payload: {
        actionType?: string;
        data?: UserData | {};
        error?: string;
    };
};

type State = {
    user?: UserData | null;
    token?: string | null;
    permissions?: { module_name: string; permissions: string[] }[];
    otp?: string;
    loading?: boolean;
    value?: boolean;
};

const Auth = (state: State = INIT_STATE, action: AuthActionType): any => {
    switch (action.type) {
        case AuthActionTypes.API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case AuthActionTypes.SEND_OTP: {
                    return {
                        ...state,
                        otp: action.payload.data,
                        loading: false,
                    };
                }
                case AuthActionTypes.LOGIN_USER: {
                    console.log('🔥 LOGIN_USER payload', action.payload);

                    const userData = action.payload.data as UserData;

                    return {
                        ...state,
                        user: userData,
                        userLoggedIn: true,
                        token: userData.token || null,
                        permissions: userData.permissions || {},
                        loading: false,
                    };
                }

                case AuthActionTypes.SIGNUP_USER: {
                    return {
                        ...state,
                        userSignUp: true,
                        loading: false,
                    };
                }
                case AuthActionTypes.LOGOUT_USER: {
                    return {
                        ...state,
                        user: null,
                        token: null,
                        permissions: [], // Clear permissions on logout
                        loading: false,
                        userLogout: true,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD: {
                    return {
                        ...state,
                        resetPasswordSuccess: action.payload.data,
                        loading: false,
                        passwordReset: true,
                    };
                }
                default:
                    return { ...state };
            }

        case AuthActionTypes.API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case AuthActionTypes.SEND_OTP: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                    };
                }
                case AuthActionTypes.LOGIN_USER: {
                    return {
                        ...state,
                        error: action.payload.error,
                        userLoggedIn: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.SIGNUP_USER: {
                    return {
                        ...state,
                        registerError: action.payload.error,
                        userSignUp: false,
                        loading: false,
                    };
                }
                case AuthActionTypes.FORGOT_PASSWORD: {
                    return {
                        ...state,
                        error: action.payload.error,
                        loading: false,
                        passwordReset: false,
                    };
                }
                default:
                    return { ...state };
            }

        case AuthActionTypes.SEND_OTP:
            return { ...state, loading: true, userLoggedIn: false };
        case AuthActionTypes.VERIFY_OTP:
            return { ...state, loading: true, userLoggedIn: false };
        case AuthActionTypes.LOGIN_USER:
            return { ...state, loading: true, userLoggedIn: false };
        case AuthActionTypes.SIGNUP_USER:
            return { ...state, loading: true, userSignUp: false };
        case AuthActionTypes.LOGOUT_USER:
            return { ...state, loading: true, userLogout: false };
        case AuthActionTypes.RESET:
            return {
                ...state,
                otp: null,
                value: false,
                loading: false,
                error: false,
                userSignUp: false,
                userLoggedIn: false,
                passwordReset: false,
                passwordChange: false,
                resetPasswordSuccess: null,
            };
        default:
            return { ...state };
    }
};

export default Auth;
