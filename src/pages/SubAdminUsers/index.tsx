import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { adminUserList, adminUserDelete, updateAdminStatus } from '../../redux/actions';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';
import SoftButton from '../uikit/Buttons/SoftButton';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
// import ToggleSwitch from '../../components/ToggleSwitch';
import ToggleSwitch from '../../components/ToggleSwitch/index';
import RegisterAdminUserModal from './RegisterAdminUserModal';
import RegAdminMod from './RegAdminMod';
import PermissionsModal from './PermissionsModal';
import { Book } from 'react-feather';

interface AdminUser {
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
    permissions: string; // Stored as a string (e.g., '{read}')
};

const AdminUser = () => {
    const { dispatch, appSelector } = useRedux();
    const { adminUsers = [], loading, error } = appSelector((state: RootState) => state.adminUser);
    console.log('adminUsers: ', adminUsers);
    const pagination = useSelector((state: RootState) => state.adminUser?.adminUsers?.data?.pagination);
    console.log('pagination: ', pagination);

    const adminUsersData = adminUsers?.data?.users || [];
    console.log('adminUsersData: ', adminUsersData);
    const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});
    const [selectedAdminUser, setSelectedAdminUser] = useState<AdminUser | null>(null);
    const [showAdminUserRegModal, setShowAdminUserRegModal] = useState(false);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);
    const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<AdminUser | null>(null);

    console.log('Admin Users: ', adminUsers);
    const permissions: Permission[] = useSelector((state: RootState) => state.Auth.user.permissions);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const userPermission = permissions.find((perm) => perm.module_name === 'Admin');

    const userPermissionsArray: string[] = userPermission
        ? userPermission.permissions.replace(/[{}]/g, '').split(/\s*,\s*/)
        : [];

    useEffect(() => {
        if (adminUsersData.length > 0) {
            const initialToggleStates: { [key: string]: boolean } = {};

            adminUsersData.forEach((adminUser: AdminUser) => {
                initialToggleStates[adminUser.admin_user_id] = adminUser.is_active;
            });

            setToggleStates(initialToggleStates);
        }
    }, [adminUsersData]);

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

    const handlePermissionClick = (user: AdminUser) => {
        console.log('Opening modal for user:', user);
        setSelectedUserForPermissions(user);
        setShowPermissionsModal(true);
    };

    const handleEditAdminUser = (adminUser: AdminUser) => {
        setSelectedAdminUser(adminUser);
        setShowAdminUserRegModal(true);
    };

    const handleCloseRegModal = () => {
        setShowAdminUserRegModal(false);
        dispatch(adminUserList);
    };

    const handleClosePermissionsModal = () => {
        setShowPermissionsModal(false);
        // dispatch(adminUserList);
    };
    const handleNextPage = () => {
        if (pagination && currentPage < pagination.totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleUserToggle = (admin_user_id: string, is_active: boolean) => {
        setToggleStates((prev) => ({
            ...prev,
            [admin_user_id]: is_active,
        }));

        dispatch(updateAdminStatus(admin_user_id, is_active));

        setTimeout(() => {
            dispatch(adminUserList);
        }, 100);
    };

    const handleDeleteAdminUser = (admin_user_id: string) => {
        if (window.confirm('Are you sure you want to delete this interest?')) {
            dispatch(adminUserDelete(admin_user_id));
        }
    };

    return userPermissionsArray.includes('read') ? (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && (
                <BorderedTable
                    title="Admin Users"
                    actionButton={
                        userPermissionsArray.includes('write') && (
                            <SoftButton variant="primary" onClick={handleAddAdminUser}>
                                Add Admin User
                            </SoftButton>
                        )
                    }>
                    <RegisterAdminUserModal
                        show={showAdminUserRegModal}
                        onClose={handleCloseRegModal}
                        adminUserToEdit={selectedAdminUser}
                    />
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th> Name</th>
                                {/* <th>Last Name</th> */}
                                <th>Contact</th>
                                <th>Status</th>
                                {/* <th>Actions</th> */}
                                <th>Actions</th>
                                <th>Permissions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminUsersData.length > 0 ? (
                                adminUsersData.map((user: AdminUser, index: number) => (
                                    <tr key={user.admin_user_id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {user.first_name} {user.last_name}
                                        </td>
                                        {/* <td>{user.last_name}</td> */}
                                        <td>{user.phone_number}</td>
                                        {/* <td>{user.is_active ? 'Active' : 'Inactive'}</td> */}
                                        <td>
                                            <ToggleSwitch
                                                checked={toggleStates[user.admin_user_id] || false}
                                                onChange={(checked) => handleUserToggle(user.admin_user_id, checked)}
                                            />
                                        </td>
                                        <td>
                                            <FaRegEdit
                                                size={20}
                                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                                onClick={() => handleEditAdminUser(user)}
                                            />
                                            <FaTrash
                                                size={20}
                                                style={{ cursor: 'pointer', color: 'red' }}
                                                onClick={() => handleDeleteAdminUser(user.admin_user_id)}
                                            />
                                        </td>

                                        <td>
                                            <td>
                                                <Book
                                                    size={20}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handlePermissionClick(user)}
                                                />
                                                <PermissionsModal
                                                    show={showPermissionsModal}
                                                    onClose={handleClosePermissionsModal}
                                                    user={
                                                        selectedUserForPermissions
                                                            ? {
                                                                  ...selectedUserForPermissions,
                                                                  permissions:
                                                                      selectedUserForPermissions.permissions.map(
                                                                          (perm, index) => ({
                                                                              permission_id: index + 1, // Assign a unique permission_id or map it based on your data
                                                                              permission_type: perm.permissions, // Use the permission string directly
                                                                          })
                                                                      ),
                                                              }
                                                            : undefined
                                                    }
                                                />
                                            </td>
                                        </td>
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
                className="pagination-controls"
                style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <SoftButton variant="secondary" onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </SoftButton>

                <span style={{ margin: '0 10px', fontWeight: 'bold' }}>
                    Page {currentPage} of {pagination?.totalPages ?? 1}
                </span>

                <SoftButton
                    variant="secondary"
                    onClick={handleNextPage}
                    disabled={currentPage >= (pagination?.totalPages ?? 1)}>
                    Next
                </SoftButton>
            </div>
        </div>
    ) : (
        <p style={{ color: 'red', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>
            You do not have permission to view this list.
        </p>
    );
};

export default AdminUser;
