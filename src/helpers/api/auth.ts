import { APICore } from './apiCore';

const api = new APICore();

// account
function sendOTP(params: { phone_number: string }) {
    const baseUrl = '/auth/otp/';
    return api.create(`${baseUrl}`, params);
}
function verifyOTP(params: { phone_number: string; otp: string }) {
    const baseUrl = '/auth/verify/';
    return api.create(`${baseUrl}`, params);
}
function login(params: { email: string; password: string }) {
    const baseUrl = '/login/';
    return api.create(`${baseUrl}`, params);
}

function logout() {
    const baseUrl = '/logout/';
    return api.create(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
    const baseUrl = '/register/';
    return api.create(`${baseUrl}`, params);
}

function forgotPassword(params: { email: string }) {
    const baseUrl = '/forget-password/';
    return api.create(`${baseUrl}`, params);
}

function interestList(data: any) {
    const baseUrl = '/interest/list';
    return api.get(`${baseUrl}`, data);
}

function interestAdd(data: any) {
    const baseUrl = '/interest/add';
    return api.create(`${baseUrl}`, data);
}
function interestUpdate(data: any) {
    const baseUrl = '/interest/update';
    return api.update(`${baseUrl}`, data);
}
function interestDelete(data: any) {
    const baseUrl = '/interest/delete';
    return api.delete(`${baseUrl}`, data);
}

export {
    sendOTP,
    verifyOTP,
    login,
    logout,
    signup,
    forgotPassword,
    interestList,
    interestAdd,
    interestDelete,
    interestUpdate,
};
