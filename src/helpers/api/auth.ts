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

function adminUserList(data: any, currentPage: number = 1, itemsPerPage: number = 10) {
    const baseUrl = '/admin/list';
    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
    });

    const fullUrl = `${baseUrl}?${params.toString()}`;
    return api.get(fullUrl, data);
}

// function adminUserList(data: any, currentPage: number = 1, itemsPerPage: number = 10) {
//     const baseUrl = '/admin/list';
//     const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//     });

//     const fullUrl = `${baseUrl}?${params.toString()}`;
//     return api.create(fullUrl, data);
// }

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

function reportList(currentPage: number = 1, itemsPerPage: number = 2) {
    const baseUrl = '/support/report/list';
    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
    });

    console.log('Constructed Params:', params.toString()); // 🔥 Debugging

    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log('Final URL:', fullUrl); // 🔥 Debugging

    return api.get(fullUrl, undefined);
}

function reportReview(data: any) {
    const baseUrl = '/support/report/review';
    return api.update(`${baseUrl}`, data);
}

function userListFilter(data: any, currentPage: number = 1, itemsPerPage: number = 10) {
    const baseUrl = '/user/list/filter';
    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
    });

    const fullUrl = `${baseUrl}?${params.toString()}`;
    return api.create(fullUrl, data);
}
// function userListFilter(data: any, page: number = 1, limit: number = 10) {
//     const baseUrl = "/user/list/filter";
//     const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//     });

//     const fullUrl = `${baseUrl}?${params.toString()}`;
//     return api.create(fullUrl, data);
// }

// function userListFilter(payload: any, page: number, limit: number) {
//     const baseUrl = `/user/list/filter?page=${page}&limit=${limit}`;

//     return api.create(baseUrl, payload); // ✅ Send pagination in query params and filters in body
// }

// function userListFilter = (payload: any, page: number, limit: number) => {
//     return api.get(`/users`, {
//         params: {
//             ...payload,
//             page,
//             limit,
//         },
//     });
// };

function userUpdateStatus(data: any) {
    const baseUrl = '/user/update/status';
    return api.update(`${baseUrl}`, data);
}

function userDelete(data: any) {
    const baseUrl = '/user/delete';
    return api.delete(`${baseUrl}`, data);
}

// function supportHelpList(currentPage: number = 1, itemsPerPage: number = 2) {
//     const baseUrl = '/support/help/list';
//     const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//     });
//     const fullUrl = `${baseUrl}?${params.toString()}`;
//     return api.get(fullUrl, {});
// }

// function supportHelpList(currentPage: number = 1, itemsPerPage: number = 2) {
//     const baseUrl = '/support/help/list';
//     const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//     });

//     const fullUrl = `${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`; // ✅ No extra `?`
//     return api.get(fullUrl, {});
// }

function supportHelpList(currentPage: number = 1, itemsPerPage: number = 2) {
    const baseUrl = '/support/help/list';
    const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
    });

    console.log('Constructed Params:', params.toString()); // 🔥 Debugging

    const fullUrl = `${baseUrl}?${params.toString()}`;
    console.log('Final URL:', fullUrl); // 🔥 Debugging

    return api.get(fullUrl, undefined);
}

function supportHelpReview(data: any) {
    const baseUrl = '/support/help/review';
    return api.update(`${baseUrl}`, data);
}
// function userListFilter(data: any, currentPage: number = 1, itemsPerPage: number = 10) {
//     const baseUrl = "/user/list/filter";
//     const params = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: itemsPerPage.toString(),
//     });

//     const fullUrl = `${baseUrl}?${params.toString()}`;
//     return api.create(fullUrl, data);
// }

function permissionModuleAdd(data: any) {
    const baseUrl = '/permission/module/add';
    return api.create(`${baseUrl}`, data);
}
function permissionModuleList(data: any) {
    const baseUrl = '/permission/module/list';
    return api.get(`${baseUrl}`, data);
}
function permissionModuleDelete(data: any) {
    const baseUrl = '/permission/module/delete';
    return api.delete(`${baseUrl}`, data);
}
function permissionAdd(data: any) {
    const baseUrl = '/permission/add';
    return api.create(`${baseUrl}`, data);
}
function permissionList(data: any) {
    const baseUrl = '/permission/list';
    return api.get(`${baseUrl}`, data);
}
function permissionDelete(data: any) {
    const baseUrl = '/permission/delete';
    return api.delete(`${baseUrl}`, data);
}
function permissionAssign(data: any) {
    const baseUrl = '/permission/assign';
    return api.update(`${baseUrl}`, data);
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
    permissionModuleAdd,
    permissionModuleList,
    permissionModuleDelete,
    permissionAdd,
    permissionAssign,
    permissionDelete,
    permissionList,
    supportHelpReview,
};
