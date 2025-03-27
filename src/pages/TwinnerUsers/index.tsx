// import React, { useEffect } from 'react';
// import { useRedux } from '../../hooks';
// import { userListFilter } from '../../redux/actions';
// import { RootState } from '../../redux/store';
// import BorderedTable from '../tables/BasicTable/BorderedTable';

// const UserManagement = () => {
//     const { dispatch, appSelector } = useRedux();

//     // Corrected: Get users array correctly
//     const users = appSelector((state: RootState) => state.userManagement.users);
//     const loading = appSelector((state: RootState) => state.userManagement.loading);
//     const error = appSelector((state: RootState) => state.userManagement.error);

//     console.log('User List Data in Component:', users);

//     useEffect(() => {
//         const filterPayload = {
//             min_age: null,
//             max_age: null,
//             education: null,
//             country: null,
//             city: null,
//             birthdate: null,
//             interested_in: null,
//         };
//         dispatch(userListFilter(filterPayload));
//     }, [dispatch]);

//     return (
//         <div>
//             <h2>Twinner Users</h2>
//             {/* {loading && <p>Loading...</p>}
//             {error && <p>Error: {error}</p>}
//             {!loading && users.length === 0 && <p>No users found</p>}
//             {!loading && users.length > 0 && (
//                 <BorderedTable data={users} />
//             )} */}
//         </div>
//     );
// };

// export default UserManagement;

import React, { useEffect, useState } from 'react';
import { useRedux } from '../../hooks';
import { userListFilter, userDelete } from '../../redux/userManagement/actions';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';
import { Table } from 'react-bootstrap';
import SoftButton from '../uikit/Buttons/SoftButton';
import { FaTrash } from 'react-icons/fa';

interface User {
    age: string;
    birthdate: string;
    city: string;
    country: string;
    education: string;
    email: string;
    user_id: string;
    interested_in: string;
    is_active: boolean;
    name: string;
}

const UserManagement = () => {
    const { dispatch, appSelector } = useRedux();
    const usersData = appSelector((state: RootState) => state.userManagement.users || []);
    const loading = appSelector((state: RootState) => state.userManagement.loading);
    const error = appSelector((state: RootState) => state.userManagement.error);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Fetch Data Once
    useEffect(() => {
        const filterPayload = {
            min_age: null,
            max_age: null,
            education: null,
            country: null,
            city: null,
            birthdate: null,
            interested_in: null,
        };
        dispatch(userListFilter(filterPayload));
    }, [dispatch]);

    // Calculate Total Pages
    const totalPages = Math.ceil(usersData.length / itemsPerPage);
    console.log('user data length', usersData.length);
    // Get the Current Page Data
    const paginatedUsers = usersData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Change Page
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDeleteUser = (user_id: string) => {
        console.log('Deleting User ID:', user_id); // Debug log
        if (window.confirm('Are you sure you want to delete this User?')) {
            dispatch(userDelete({ user_id }));
        }
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && (
                <BorderedTable title="Twinner Users">
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>#</th>

                                <th>Name</th>
                                <th>Age</th>
                                <th>Birthday</th>
                                <th>City</th>
                                <th>Country</th>
                                <th>Education</th>
                                <th>Email</th>
                                <th>Interested In</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((user: User, index: number) => (
                                    <tr key={user.user_id}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

                                        <td>{user.name}</td>
                                        <td>{user.age}</td>
                                        <td>{user.birthdate}</td>
                                        <td>{user.city}</td>
                                        <td>{user.country}</td>
                                        <td>{user.education}</td>
                                        <td>{user.email}</td>
                                        <td>{user.interested_in}</td>
                                        <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                                        <td>
                                            <FaTrash
                                                size={20}
                                                style={{ cursor: 'pointer', color: 'red' }}
                                                onClick={() => handleDeleteUser(user.user_id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={12} className="text-center">
                                        No Users Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </BorderedTable>
            )}

            {/* Pagination Controls */}
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <SoftButton
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}>
                    Previous
                </SoftButton>

                <span style={{ margin: '0 10px' }}>
                    Page {currentPage} of {totalPages}
                </span>

                <SoftButton
                    variant="secondary"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}>
                    Next
                </SoftButton>
            </div>
        </div>
    );
};

export default UserManagement;
