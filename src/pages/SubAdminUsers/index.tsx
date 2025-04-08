import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { adminUserList, adminUserDelete, updateAdminStatus } from '../../redux/actions';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';
import AdvancedTable from '../tables/AdvancedTable';
import SoftButton from '../uikit/Buttons/SoftButton';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
// import ToggleSwitch from '../../components/ToggleSwitch';
import ToggleSwitch from '../../components/ToggleSwitch/index';
import RegisterAdminUserModal from './RegisterAdminUserModal';
import RegAdminMod from './RegAdminMod';
import PermissionsModal from './PermissionsModal';
import { Book } from 'react-feather';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import SuccessModal from '../../components/SuccessModal';

interface AdminUserProps {
    admin_user_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    is_active: boolean;
    phone_number: string;
    permissions: Permission[];
}

type Permission = {
    module_name: string;
    permissions: string | string[]; // Stored as a string (e.g., '{read}')
};

const AdminUser = () => {
    const { dispatch, appSelector } = useRedux();
    const { adminUsers = [], loading, error } = appSelector((state: RootState) => state.adminUser);
    // console.log('adminUsers: ', adminUsers);
    const pagination = useSelector((state: RootState) => state.adminUser.pagination);
    console.log('pagination: ', pagination?.totalPages);

    // const adminUsersData = adminUsers?.data?.users || [];
    // console.log('adminUsersData: ', adminUsersData);
    // const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});
    const [selectedAdminUser, setSelectedAdminUser] = useState<AdminUserProps | null>(null);
    const [showAdminUserRegModal, setShowAdminUserRegModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<any | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddSuccessModal, setShowAddSuccessModal] = useState(false);
    const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);

    const [adminUserToDelete, setAdminUserToDelete] = useState<string | null>(null);

    // console.log('Admin Users: ', adminUsers);
    // const permissions: Permission[] = useSelector((state: RootState) => state.Auth.user.permissions);
    const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 10;
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // const userPermission = permissions.find((perm) => perm.module_name === 'Admin');
    // const userPermissionOnly = permissions.find((perm) => perm.module_name === 'Permissions');

    // const userPermissionsArrayOnly: string[] = userPermissionOnly
    //     ? Array.isArray(userPermissionOnly.permissions)
    //         ? userPermissionOnly.permissions // Already an array, use as is
    //         : typeof userPermissionOnly.permissions === 'string'
    //         ? userPermissionOnly.permissions.replace(/[{}]/g, '').split(/\s*,\s*/) // Convert string to array
    //         : []
    //     : [];

    // const userPermissionsArray: string[] = userPermission
    //     ? Array.isArray(userPermission.permissions)
    //         ? userPermission.permissions // Already an array, use as is
    //         : typeof userPermission.permissions === 'string'
    //         ? userPermission.permissions.replace(/[{}]/g, '').split(/\s*,\s*/) // Convert string to array
    //         : []
    //     : [];
    const permissionsObj = useSelector((state: RootState) => state.Auth.user.data.permissions);
    console.log('permissionsObj:', permissionsObj);

    const userPermissionsArray: string[] = permissionsObj?.Admin || [];
    console.log('userPermissionsArray:', userPermissionsArray);

    const userPermissionsArrayOnly: string[] = permissionsObj?.Permissions || [];

    // useEffect(() => {
    //     if (adminUsers.length > 0) {
    //         const initialToggleStates: { [key: string]: boolean } = {};

    //         adminUsers.forEach((adminUser: AdminUserProps) => {
    //             initialToggleStates[adminUser.admin_user_id] = adminUser.is_active;
    //         });

    //         setToggleStates(initialToggleStates);
    //     }
    // }, [adminUsers]);

    useEffect(() => {
        // Dispatch to fetch admin users whenever currentPage changes
        const page = currentPage; // Ensure this is a number
        const limit = itemsPerPage; // Ensure this is a number

        dispatch(adminUserList(page, limit)); // Correctly pass the numbers to the action
        // Pass currentPage to fetch the correct page of data
    }, [dispatch, currentPage]);

    const handleAddAdminUser = () => {
        setSelectedAdminUser(null);
        setShowAdminUserRegModal(true);
    };

    const handlePermissionClick = (user: AdminUserProps) => {
        // console.log('Opening modal for user:', user);
        setSelectedUserForPermissions({ ...user });
        setShowPermissionsModal(true);
    };

    useEffect(() => {
        console.log('Updated selectedUserForPermissions:', selectedUserForPermissions);
    }, [selectedUserForPermissions]);

    const handleEditAdminUser = (adminUser: AdminUserProps) => {
        setSelectedAdminUser(adminUser);
        setShowAdminUserRegModal(true);
    };

    // const handleCloseRegModal = () => {
    //     setShowAdminUserRegModal(false);
    //     dispatch(adminUserList(currentPage, itemsPerPage));
    //     setShowSuccessModal(true);
    // };

    const handleClosePermissionsModal = () => {
        setShowPermissionsModal(false);
        // dispatch(adminUserList);
    };

    const handleUserToggle = (admin_user_id: string, is_active: boolean) => {
        // setToggleStates((prev) => ({
        //     ...prev,
        //     [admin_user_id]: is_active,
        // }));

        dispatch(updateAdminStatus(admin_user_id, is_active));

        setTimeout(() => {
            dispatch(adminUserList(currentPage, itemsPerPage));
        }, 100);
    };

    // const handleDeleteAdminUser = (admin_user_id: string) => {
    //     if (window.confirm('Are you sure you want to delete this interest?')) {
    //         // Dispatch the delete action
    //         dispatch(adminUserDelete(admin_user_id));
    //     }
    //     setTimeout(() => {
    //         dispatch(adminUserList(currentPage, itemsPerPage));
    //     }, 500);
    // };
    const handleDeleteClick = (admin_user_id: string) => {
        setAdminUserToDelete(admin_user_id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (adminUserToDelete) {
            dispatch(adminUserDelete(adminUserToDelete));
            setTimeout(() => {
                dispatch(adminUserList(currentPage, itemsPerPage));
            }, 500);
        }
        setShowDeleteModal(false);
    };

    //     const handleDeleteAdminUser = (admin_user_id: string) => {
    //     if (window.confirm('Are you sure you want to delete this user?')) {
    //         dispatch(adminUserDelete(admin_user_id)).then(() => {
    //             dispatch(adminUserList(currentPage, itemsPerPage)); // ✅ Refresh the list after delete
    //         });
    //     }
    // };

    return userPermissionsArray.includes('read') ? (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && (
                <BorderedTable
                    title="Admin Users"
                    actionButton={
                        userPermissionsArray.includes('write') && (
                            <div style={{ marginBottom: '8px' }}>
                                <SoftButton variant="primary" onClick={handleAddAdminUser}>
                                    Add Admin User
                                </SoftButton>
                            </div>
                        )
                    }>
                    <RegisterAdminUserModal
                        show={showAdminUserRegModal}
                        onClose={() => setShowAdminUserRegModal(false)}
                        onSuccess={(isUpdate: boolean) => {
                            dispatch(adminUserList(currentPage, itemsPerPage));
                            setShowAdminUserRegModal(false);

                            if (isUpdate) {
                                setShowUpdateSuccessModal(true);
                            } else {
                                setShowAddSuccessModal(true);
                            }
                        }}
                        adminUserToEdit={selectedAdminUser}
                    />

                    <SuccessModal
                        show={showAddSuccessModal}
                        onClose={() => setShowAddSuccessModal(false)}
                        message="Admin user has been Added successfully!"
                    />
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th> Name</th>
                                {/* <th>Last Name</th> */}
                                <th>Contact</th>
                                {userPermissionsArray?.includes('update') && <th>Status</th>}
                                {/* <th>Actions</th> */}
                                {/* <th>Permissions</th> */}
                                {(userPermissionsArray?.includes('update') ||
                                    userPermissionsArray?.includes('delete')) && <th>Actions</th>}

                                {userPermissionsArrayOnly?.includes('write') && <th>Permissions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {adminUsers.length > 0 ? (
                                adminUsers.map((user: AdminUserProps, index: number) => (
                                    <tr key={user.admin_user_id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {user.first_name} {user.last_name}
                                        </td>
                                        {/* <td>{user.last_name}</td> */}
                                        <td>{user.phone_number}</td>
                                        {/* <td>{user.is_active ? 'Active' : 'Inactive'}</td> */}
                                        {userPermissionsArray?.includes('update') && (
                                            <td>
                                                <ToggleSwitch
                                                    checked={user.is_active}
                                                    onChange={(checked) =>
                                                        handleUserToggle(user.admin_user_id, checked)
                                                    }
                                                />
                                            </td>
                                        )}
                                        {/* <td>
                                            <Book size={20} style={{ cursor: 'pointer' }} />
                                        </td> */}
                                        <td>
                                            <td>
                                                {userPermissionsArray?.includes('update') && (
                                                    <FaRegEdit
                                                        size={20}
                                                        style={{ cursor: 'pointer', marginRight: '10px' }}
                                                        onClick={() => handleEditAdminUser(user)}
                                                    />
                                                )}
                                                <SuccessModal
                                                    show={showUpdateSuccessModal}
                                                    onClose={() => setShowUpdateSuccessModal(false)}
                                                    message="Admin user has been Updated successfully!"
                                                />

                                                {userPermissionsArray?.includes('delete') && (
                                                    <FaTrash
                                                        size={20}
                                                        style={{ cursor: 'pointer', color: 'red' }}
                                                        onClick={() => handleDeleteClick(user.admin_user_id)}
                                                    />
                                                )}
                                                <ConfirmDeleteModal
                                                    show={showDeleteModal}
                                                    onClose={() => setShowDeleteModal(false)}
                                                    onConfirm={confirmDelete}
                                                    title="Delete Admin User"
                                                    message="Are you sure you want to delete this admin user? This action cannot be undone."
                                                />
                                            </td>
                                        </td>

                                        {userPermissionsArrayOnly?.includes('write') && (
                                            <td>
                                                <Book
                                                    size={20}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handlePermissionClick(user)}
                                                />

                                                <PermissionsModal
                                                    show={showPermissionsModal}
                                                    onClose={handleClosePermissionsModal}
                                                    user={selectedUserForPermissions}
                                                />
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center">
                                        No Admin Users Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </BorderedTable>
            )}
            {/* Pagination Controls */}
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '24px',
                    flexWrap: 'wrap',
                    gap: '24px',
                }}>
                {/* Pagination Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <SoftButton
                        variant="secondary"
                        onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage <= 1}
                        className="px-4 py-2">
                        Previous
                    </SoftButton>

                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#4B5563' }}>
                        Page {currentPage} of {pagination?.totalPages ?? 1}
                    </span>

                    <SoftButton
                        variant="secondary"
                        onClick={() =>
                            currentPage < (pagination?.totalPages ?? 1) && setCurrentPage((prev) => prev + 1)
                        }
                        disabled={currentPage >= (pagination?.totalPages ?? 1)}
                        className="px-4 py-2">
                        Next
                    </SoftButton>
                </div>

                {/* Items Per Page */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label
                        style={{
                            fontWeight: '600',
                            fontSize: '14px',
                            color: '#374151',
                        }}>
                        Items per page:
                    </label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setItemsPerPage(Number(e.target.value));
                        }}
                        style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            fontSize: '14px',
                            color: '#374151',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer',
                            minWidth: '100px',
                        }}>
                        {[5, 10, 25, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <SoftButton
                        variant="secondary"
                        onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                        disabled={currentPage <= 1}
                        className="px-4 py-2">
                        Previous
                    </SoftButton>

                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#4B5563' }}>
                        Page {currentPage} of {pagination?.totalPages ?? 1}
                    </span>

                    <SoftButton
                        variant="secondary"
                        onClick={() =>
                            currentPage < (pagination?.totalPages ?? 1) && setCurrentPage((prev) => prev + 1)
                        }
                        disabled={currentPage >= (pagination?.totalPages ?? 1)}
                        className="px-4 py-2">
                        Next
                    </SoftButton>
                </div>
            </div> */}
        </div>
    ) : (
        <p style={{ color: 'red', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>
            You do not have permission to view this list.
        </p>
    );
};

export default AdminUser;
