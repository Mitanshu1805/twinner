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
import { Table, Button, Form, Modal } from 'react-bootstrap';
import SoftButton from '../uikit/Buttons/SoftButton';
import { FaTrash, FaFilter } from 'react-icons/fa';
import ToggleSwitch from '../../components/ToggleSwitch';
import { Filter } from 'react-feather';
import { number } from 'yup';

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
    page: number;
    limit: number;
}

const UserManagement = () => {
    const { dispatch, appSelector } = useRedux();
    const usersData = appSelector((state: RootState) => state.userManagement.users || []);
    const loading = appSelector((state: RootState) => state.userManagement.loading);
    const error = appSelector((state: RootState) => state.userManagement.error);
    const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>({});

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [filtersApplied, setFiltersApplied] = useState(false);

    const [filters, setFilters] = useState({
        min_age: null,
        max_age: null,
        education: '',
        country: '',
        city: '',
        birthdate: '',
        interested_in: '',
        progress_status: '',
    });

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
            // page: Number(currentPage),
            // limit: Number(itemsPerPage),
        };
        dispatch(userListFilter(filterPayload));
        // dispatch(userListFilter(filterPayload, currentPage, itemsPerPage));

        // dispatch(userListFilter({ ...filterPayload, page: currentPage, limit: itemsPerPage }));
    }, [dispatch]);

    // Calculate Total Pages
    // const totalPages = Math.ceil(usersData.length / itemsPerPage);
    // console.log('user data length', usersData.length);
    // // Get the Current Page Data
    // const paginatedUsers = usersData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Change Page
    // const handlePageChange = (newPage: number) => {
    //     if (newPage >= 1 && newPage <= totalPages) {
    //         setCurrentPage(newPage);
    //     }
    // };

    const handleDeleteUser = (user_id: string) => {
        console.log('Deleting User ID:', user_id); // Debug log
        if (window.confirm('Are you sure you want to delete this User?')) {
            dispatch(userDelete({ user_id }));
        }
    };

    const handleShowModal = () => setShowFilterModal(true);
    // const handleCloseModal = () => setShowFilterModal(false);
    const handleCloseModal = () => {
        setFilters({
            min_age: null,
            max_age: null,
            education: '',
            country: '',
            city: '',
            birthdate: '',
            interested_in: '',
            progress_status: '',
        });

        setShowFilterModal(false); // Assuming you're using a state variable for modal visibility
    };

    // const handleFilterChange: React.ChangeEventHandler<any> = (e) => {
    //     const { name, value, type } = e.target;

    //     setFilters((prevFilters) => ({
    //         ...prevFilters,
    //         [name]: type === 'number' ? (value ? Number(value) : null) : value,
    //     }));
    // };

    const handleFilterChange: React.ChangeEventHandler<any> = (e) => {
        const { name, value, type } = e.target;

        setFilters((prevFilters) => {
            const updatedFilters: any = {
                ...prevFilters,
                [name]: type === 'number' ? (value ? Number(value) : null) : value,
            };

            // If min_age is set and max_age is empty, set max_age to 100
            if (name === 'min_age' && !prevFilters.max_age) {
                updatedFilters.max_age = 100;
            }

            // If max_age is cleared, reset min_age to 0
            if (name === 'max_age' && !value) {
                updatedFilters.min_age = 0;
            }

            if (name === 'max_age' && !prevFilters.min_age) {
                updatedFilters.min_age = 1;
            }

            if (name === 'min_age' && !value) {
                updatedFilters.max_age = 0;
            }

            return updatedFilters;
        });
    };

    // Apply Filters
    const handleApplyFilters = async () => {
        try {
            setFiltersApplied(true); // Mark that a filter was applied

            const updatedFilters = {
                ...filters,
                min_age: filters.min_age ? Number(filters.min_age) : null,
                max_age: filters.max_age ? Number(filters.max_age) : null,
                page: currentPage, // ✅ Add page
                limit: itemsPerPage, // ✅ Add limit
            };

            await Promise.resolve(dispatch(userListFilter(updatedFilters)));

            console.log('Filter applied, waiting for usersData update...');
            handleCloseModal();
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    // Check for no data AFTER Redux state updates
    useEffect(() => {
        if (filtersApplied && !loading) {
            console.log('Checking usersData:', usersData); // Debugging
            if (usersData.length === 0) {
                alert('No data found for the applied filters.');
            }
            setFiltersApplied(false); // Reset flag after showing the alert
        }
    }, [usersData, loading, filtersApplied]);

    return (
        <div>
            {/* Filter Button */}
            <Button variant="primary" onClick={handleShowModal} style={{ marginBottom: '10px' }}>
                <FaFilter /> Filter Users
            </Button>

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
                            {usersData.length > 0 ? (
                                usersData.map((user: User, index: number) => (
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
            <div
                className="pagination-controls"
                style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <SoftButton
                    variant="secondary"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className={currentPage === 1 ? 'disabled-button' : ''}>
                    Previous
                </SoftButton>

                <SoftButton
                    variant="secondary"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={usersData.length < itemsPerPage ? 'disabled-button' : ''}>
                    Next
                </SoftButton>
            </div>
            <Modal show={showFilterModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            {/* Age Range */}
                            <div className="col-md-6">
                                <Form.Group controlId="min_age">
                                    <Form.Label>Min Age</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="min_age"
                                        value={filters.min_age || ''}
                                        onChange={handleFilterChange}
                                        placeholder="Enter min age"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="max_age">
                                    <Form.Label>Max Age</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="max_age"
                                        value={filters.max_age || ''}
                                        onChange={handleFilterChange}
                                        placeholder="Enter max age"
                                    />
                                </Form.Group>
                            </div>

                            {/* Education & Interested In */}
                            <div className="col-md-6">
                                <Form.Group controlId="education">
                                    <Form.Label>Education</Form.Label>

                                    <Form.Select
                                        name="education"
                                        value={filters.education}
                                        onChange={handleFilterChange}>
                                        <option value="">Select Education</option>
                                        <option value="High school">High school</option>
                                        <option value="Non-degree qualification">Non-degree qualification</option>
                                        <option value="Undergraduate degree">Undergraduate degree</option>
                                        <option value="Postgraduate degree">Postgraduate degree</option>
                                        <option value="Doctorate">Doctorate</option>
                                        <option value="Other educational level">Other educational level</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="interested_in">
                                    <Form.Label>Interested In</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="interested_in"
                                        value={filters.interested_in}
                                        onChange={handleFilterChange}
                                        placeholder="Enter interest"
                                    />
                                </Form.Group>
                            </div>

                            {/* Country & City */}
                            <div className="col-md-6">
                                <Form.Group controlId="country">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="country"
                                        value={filters.country}
                                        onChange={handleFilterChange}
                                        placeholder="Enter country"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group controlId="city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={filters.city}
                                        onChange={handleFilterChange}
                                        placeholder="Enter city"
                                    />
                                </Form.Group>
                            </div>

                            {/* Progress Status */}
                            <div className="col-md-12">
                                <Form.Group controlId="progress_status">
                                    <Form.Label>Progress Status</Form.Label>
                                    <Form.Select
                                        name="progress_status"
                                        value={filters.progress_status || ''}
                                        onChange={handleFilterChange}>
                                        <option value="">Select Progress Status</option>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="completed">Completed</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    {/* <Button variant="danger" onClick={() => setFilters({})}>
                        Reset Filters
                    </Button> */}
                    <Button variant="primary" onClick={handleApplyFilters}>
                        Apply Filters
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserManagement;
