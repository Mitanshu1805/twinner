import { all, fork, put, takeEvery, call } from 'redux-saga/effects';
import { SagaIterator } from '@redux-saga/core';

// apicore
import { APICore, setAuthorization } from '../../helpers/api/apiCore';

// helpers
import {
    login as loginApi,
    logout as logoutApi,
    signup as signupApi,
    sendOTP as sendOTPApi,
    forgotPassword as forgotPasswordApi,
    verifyOTP as verifyOTPApi,
} from '../../helpers/';

// actions
import { authApiResponseSuccess, authApiResponseError } from './actions';

// constants
import { AuthActionTypes } from './constants';

type UserData = {
    payload: {
        phone_number: string;
        otp: string;
        username: string;
        password: string;
        fullname: string;
        email: string;
    };
    type: string;
};

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */
// function* login({ payload: { email, password }, type }: UserData): SagaIterator {
//     try {
//         const response = yield call(loginApi, { email, password });
//         const user = response.data || [];
//         const token = user.token || null;
//         const permissions = user.permissions || [];
//         // NOTE - You can change this according to response format from your api
//         api.setLoggedInUser(user);
//         setAuthorization(token);
//         yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, { ...user, token, permissions }));
//     } catch (error: any) {
//         yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
//         api.setLoggedInUser(null);
//         setAuthorization(null);
//     }
// }

function* login({ payload: { email, password }, type }: UserData): SagaIterator {
    try {
        const response = yield call(loginApi, { email, password });
        const user = response.data || [];
        const token = user.token || null;
        const rawPermissions = user.permissions || [];

        const parsedPermissions: Record<string, string[]> = {};
        rawPermissions.forEach((item: any) => {
            const perms = item.permissions
                .replace(/[{}]/g, '')
                .split(',')
                .map((perm: string) => perm.trim());

            parsedPermissions[item.module_name] = perms;
        });

        // NOTE - You can change this according to response format from your api
        api.setLoggedInUser(user);
        setAuthorization(token);
        yield put(
            authApiResponseSuccess(AuthActionTypes.LOGIN_USER, {
                ...user,
                token,
                permissions: parsedPermissions,
            })
        );
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}
// function* sendOTP({ payload: { phone_number }, type }: UserData): SagaIterator {
//     try {
//         console.log('🚀 => function*sendOTP => phone_number:', phone_number);
//         const response = yield call(sendOTPApi, { phone_number });
//         console.log('🚀 => function*sendOTP => user:', response);
//         const otp = response.data.data.otp;
//         console.log('🚀 => function*sendOTP => otp:', otp);
//         // NOTE - You can change this according to response format from your api
//         // setAuthorization(user['token']);
//         yield put(authApiResponseSuccess(AuthActionTypes.SEND_OTP, otp));
//     } catch (error: any) {
//         console.log('🚀 => function*sendOTP => error:', error);
//         yield put(authApiResponseError(AuthActionTypes.SEND_OTP, error));
//         api.setLoggedInUser(null);
//         setAuthorization(null);
//     }
// }
function* sendOTP({ payload: { phone_number }, type }: UserData): SagaIterator {
    try {
        console.log('🚀 => function*sendOTP => phone_number:', phone_number);
        const response = yield call(sendOTPApi, { phone_number });

        console.log('🚀 Full API response:', response);

        // Make sure response and nested fields exist
        const otp = response?.data?.data?.otp;

        if (!otp) throw new Error('User with this phone number not found');

        console.log('🚀 Extracted OTP:', otp);

        yield put(authApiResponseSuccess(AuthActionTypes.SEND_OTP, otp));
    } catch (error: any) {
        console.log('🚀 Full Error object:', error);

        let errorMessage = 'Something went wrong';

        if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        console.log('🚀 => function*sendOTP => errorMessage:', errorMessage);

        yield put(authApiResponseError(AuthActionTypes.SEND_OTP, errorMessage));

        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

function* verifyOTP({ payload: { phone_number, otp } }: UserData): SagaIterator {
    try {
        const response = yield call(verifyOTPApi, { phone_number, otp });

        const rawUser = response.data?.data || {};
        console.log('��� => function*verifyOTP => rawUser:', rawUser);
        const token = rawUser.token || null;
        const rawPermissions = rawUser.permissions || [];
        console.log('rawPermissions>>>>', rawPermissions);

        const parsedPermissions: Record<string, string[]> = {};
        rawPermissions.forEach((item: any) => {
            const perms = item.permissions
                .replace(/[{}]/g, '')
                .split(',')
                .map((perm: string) => perm.trim());
            parsedPermissions[item.module_name] = perms;
        });

        // ✅ Create a new user object with parsed permissions
        const user = {
            ...rawUser,
            permissions: parsedPermissions,
        };

        yield put(
            authApiResponseSuccess(AuthActionTypes.LOGIN_USER, {
                data: user, // ✅ store full user under 'data'
                token: token, // ✅ token outside
            })
        );

        api.setLoggedInUser(user); // optional: for localStorage if you're using it
        setAuthorization(token);
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

/**
 * Logout the user
 */
function* logout(): SagaIterator {
    try {
        yield call(logoutApi);
        api.setLoggedInUser(null);
        setAuthorization(null);
        yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error));
    }
}

function* signup({ payload: { fullname, email, password } }: UserData): SagaIterator {
    try {
        const response = yield call(signupApi, { fullname, email, password });
        const user = response.data;
        // api.setLoggedInUser(user);
        // setAuthorization(user['token']);
        yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, user));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error));
        api.setLoggedInUser(null);
        setAuthorization(null);
    }
}

function* forgotPassword({ payload: { email } }: UserData): SagaIterator {
    try {
        const response = yield call(forgotPasswordApi, { email });
        yield put(authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, response.data));
    } catch (error: any) {
        yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error));
    }
}
export function* watchSendOTP() {
    yield takeEvery(AuthActionTypes.SEND_OTP, sendOTP);
}

export function* watchVerifyOTP() {
    yield takeEvery(AuthActionTypes.VERIFY_OTP, verifyOTP);
}
export function* watchLoginUser() {
    yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}

export function* watchLogout() {
    yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup(): any {
    yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword(): any {
    yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

function* authSaga() {
    yield all([
        fork(watchSendOTP),
        fork(watchVerifyOTP),
        fork(watchLoginUser),
        fork(watchLogout),
        fork(watchSignup),
        fork(watchForgotPassword),
    ]);
}

export default authSaga;
