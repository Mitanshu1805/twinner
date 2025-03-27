// import { reportList } from './../../redux/report/actions';
// import { UpdateAdminStatus } from './../../redux/subAdminUser/actions';
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

function adminUserList(data: any) {
    const baseUrl = '/admin/list';
    return api.get(`${baseUrl}`, data);
}

function adminUserAdd(data: any) {
    const baseUrl = '/admin/register';
    return api.create(`${baseUrl}`, data);
}
function adminUserDelete(data: any) {
    const baseUrl = '/admin/delete';
    return api.delete(`${baseUrl}`, data);
}
function adminUserUpdate(data: any) {
    const baseUrl = '/admin/update';
    return api.update(`${baseUrl}`, data);
}
function updateAdminStatus(data: any) {
    const baseUrl = '/admin/update/status';
    return api.update(`${baseUrl}`, data);
}

function reportList(data: any) {
    const baseUrl = '/support/report/list';
    return api.get(`${baseUrl}`, data);
}

function reportReview(data: any) {
    const baseUrl = '/support/report/review';
    return api.update(`${baseUrl}`, data);
}

function userListFilter(data: any) {
    const baseUrl = '/user/list/filter';
    return api.create(`${baseUrl}`, data);
}

function userUpdateStatus(data: any) {
    const baseUrl = '/user/update/status';
    return api.update(`${baseUrl}`, data);
}

function userDelete(data: any) {
    const baseUrl = '/user/delete';
    return api.delete(`${baseUrl}`, data);
}

function supportHelpList(data: any) {
    const baseUrl = '/support/help/list';
    return api.get(`${baseUrl}`, data);
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
    adminUserList,
    adminUserAdd,
    adminUserDelete,
    adminUserUpdate,
    updateAdminStatus,
    reportList,
    reportReview,
    userListFilter,
    userUpdateStatus,
    userDelete,
    supportHelpList,
};
