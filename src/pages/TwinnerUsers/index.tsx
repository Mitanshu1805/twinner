import React, { useEffect, useState } from 'react';
import { useRedux } from '../../hooks';
import { userListFilter, userDelete, userUpdateStatus } from '../../redux/userManagement/actions';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Eye } from 'react-feather';
import SoftButton from '../uikit/Buttons/SoftButton';
import { FaTrash, FaFilter } from 'react-icons/fa';
import ToggleSwitch from '../../components/ToggleSwitch/index';
import { Filter } from 'react-feather';
import { number } from 'yup';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import BlockRelation from './BlockRelation';

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
    phone_number: string;
    limit: number;
}
const UserManagement = () => {
    const { dispatch, appSelector } = useRedux();
    const usersData = appSelector((state: RootState) => state.userManagement.users || []);
    console.log('Users Data', usersData);
    const check = appSelector((state: RootState) => state.userManagement.users || []);
    console.log('Check', usersData);
    const loading = appSelector((state: RootState) => state.userManagement.loading);
    const error = appSelector((state: RootState) => state.userManagement.error);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);

    const [twinnerUserToDelete, setTwinnerUserToDelete] = useState<string | null>(null);
    // const permissions: Permission[] = useSelector((state: RootState) => state.Auth.user.permissions);
    // const userPermission = permissions.find((perm) => perm.module_name === 'User');
    // const userPermissionsArray: string[] = userPermission
    //     ? userPermission.permissions.replace(/[{}]/g, '').split(/\s*,\s*/)
    //     : [];
    const permissionsObj = useSelector((state: RootState) => state.Auth.user?.data?.permissions);
    console.log('permissionsObj>>>>>>', permissionsObj);
    const userPermissionsArray: string[] = permissionsObj?.User || [];
    console.log('userPermissionsArray>>>>>>', userPermissionsArray);

    const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 10;
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // const paginatedUsers = usersData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    console.log('startIndex: ', startIndex);
    console.log('itemsPerPage: ', itemsPerPage);
    console.log('usersData>>>>: ', usersData);
    const paginatedUsers = usersData.slice(startIndex, startIndex + itemsPerPage);
    console.log('paginatedUsers', paginatedUsers);
    const users = useSelector((state: RootState) => state.userManagement.users);
    const pagination = useSelector((state: RootState) => state.userManagement.pagination);
    console.log('Pagination in twinner users: ', pagination);

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
        search: null,
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
            search: null,
        };
        // console.log('Dispatching filterPayload:', filterPayload);
        // console.log('📌 Users in Component:', paginatedUsers);
        dispatch(userListFilter(filterPayload, currentPage, itemsPerPage));
    }, [dispatch, currentPage, itemsPerPage]);

    // useEffect(() => {
    //     if (paginatedUsers.length > 0) {
    //         const initialToggleStates: { [key: string]: boolean } = {};

    //         paginatedUsers.forEach((user: User) => {
    //             initialToggleStates[user.user_id] = user.is_active;
    //         });

    //         setToggleStates(initialToggleStates);
    //     }
    // }, [paginatedUsers]);

    const handleDeleteUser = (user_id: string) => {
        // console.log('Deleting User ID:', user_id); // Debug log
        if (window.confirm('Are you sure you want to delete this User?')) {
            dispatch(userDelete({ user_id }));
        }
    };

    const handleDeleteClick = (user_id: string) => {
        setTwinnerUserToDelete(user_id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (twinnerUserToDelete) {
            dispatch(userDelete({ user_id: twinnerUserToDelete })); // ✅ wrap it in an object
        }
        setShowDeleteModal(false);
    };

    const handleShowModal = () => setShowFilterModal(true);
    // const handleCloseModal = () => setShowFilterModal(false);
    const handleCloseModal = () => {
        setFilters({
            min_age: filters?.min_age,
            max_age: filters?.max_age,
            education: filters?.education,
            country: filters?.country,
            city: filters?.city,
            birthdate: filters?.birthdate,
            interested_in: filters?.interested_in,
            progress_status: filters?.progress_status,
            search: filters?.search,
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
            if (name === 'search') {
                if (value.length >= 3 || value.length === 0) {
                    dispatch(userListFilter({ ...updatedFilters }, 1, itemsPerPage));
                }
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
            };

            setCurrentPage(1);

            await Promise.resolve(dispatch(userListFilter(updatedFilters, currentPage, itemsPerPage)));

            // console.log('Filter applied, waiting for usersData update...');
            handleCloseModal();
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    };

    const handleUserToggle = (user_id: string, is_active: boolean) => {
        // setToggleStates((prev) => ({
        //     ...prev,
        //     [user_id]: is_active,
        // }));

        dispatch(userUpdateStatus(user_id, is_active));

        setTimeout(() => {
            dispatch(userListFilter(filters, currentPage, itemsPerPage));
        }, 100);
    };

    // Check for no data AFTER Redux state updates
    useEffect(() => {
        if (filtersApplied && !loading) {
            // console.log('Checking usersData:', usersData); // Debugging
            if (usersData.length === 0) {
                alert('No data found for the applied filters.');
            }
            setFiltersApplied(false); // Reset flag after showing the alert
        }
    }, [usersData, loading, filtersApplied]);

    return userPermissionsArray.includes('read') ? (
        <div>
            {/* Page Header */}
            {/* <h2 style={{ marginBottom: '16px', fontWeight: '600', color: '#111827' }}>Twinner Users</h2> */}
            {/* Filter Button */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '10px',
                    gap: '12px',
                    flexWrap: 'wrap',
                }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button variant="primary" onClick={handleShowModal}>
                        <FaFilter /> Filter Users
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowBlockModal(true);
                        }}>
                        🚫 Blocked Users
                    </Button>
                </div>

                <BlockRelation show={showBlockModal} onClose={() => setShowBlockModal(false)} />

                <Form.Control
                    type="text"
                    placeholder="Search by Name or Contact"
                    name="search"
                    value={filters.search ?? ''}
                    onChange={handleFilterChange}
                    style={{ maxWidth: '250px' }}
                />
            </div>

            {/* <Eye /> */}

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && (
                <BorderedTable title="Twinner Users" totalRecords={pagination?.totalRecords}>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Birthday</th>
                                <th>City</th>
                                <th>Phone Number</th>
                                <th>Country</th>
                                <th>Education</th>
                                <th>Email</th>
                                <th>Interested In</th>
                                <th>Status</th>

                                {userPermissionsArray?.includes('delete') && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {usersData?.length > 0 ? (
                                usersData.map((user: User, index: number) => (
                                    <tr key={user.user_id}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.age}</td>
                                        <td>{new Date(user.birthdate).toLocaleDateString()}</td>

                                        <td>{user.city}</td>
                                        <td>{user.phone_number}</td>
                                        <td>{user.country}</td>
                                        <td>{user.education}</td>
                                        <td>{user.email}</td>
                                        <td>{user.interested_in}</td>
                                        <td>
                                            <ToggleSwitch
                                                checked={user.is_active}
                                                onChange={(checked) => handleUserToggle(user.user_id, checked)}
                                            />
                                        </td>
                                        {userPermissionsArray?.includes('delete') && (
                                            <td>
                                                <FaTrash
                                                    size={20}
                                                    style={{ cursor: 'pointer', color: 'red' }}
                                                    onClick={() => handleDeleteClick(user.user_id)}
                                                />
                                                <ConfirmDeleteModal
                                                    show={showDeleteModal}
                                                    onClose={() => setShowDeleteModal(false)}
                                                    onConfirm={confirmDelete}
                                                    title="Delete Twinner User"
                                                    message="Are you sure you want to delete this twinner user? This action cannot be undone."
                                                />
                                            </td>
                                        )}
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

            <Modal show={showFilterModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            {/* Age Range */}
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="min_age">
                                    <Form.Label>Min Age</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="min_age"
                                        value={filters?.min_age ?? ''}
                                        onChange={handleFilterChange}
                                        placeholder="Enter min age"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="max_age">
                                    <Form.Label>Max Age</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="max_age"
                                        value={filters?.max_age ?? ''}
                                        onChange={handleFilterChange}
                                        placeholder="Enter max age"
                                    />
                                </Form.Group>
                            </div>

                            {/* Education & Interested In */}
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="education">
                                    <Form.Label>Education</Form.Label>
                                    <Form.Select
                                        name="education"
                                        value={filters?.education ?? ''}
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
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="interested_in">
                                    <Form.Label>Interested In</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="interested_in"
                                        value={filters?.interested_in ?? ''}
                                        onChange={handleFilterChange}
                                        placeholder="Enter interest"
                                    />
                                </Form.Group>
                            </div>

                            {/* Country & City */}
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="country">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="country"
                                        value={filters?.country ?? ''}
                                        onChange={handleFilterChange}
                                        placeholder="Enter country"
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Group controlId="city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="city"
                                        value={filters?.city ?? ''}
                                        onChange={handleFilterChange}
                                        placeholder="Enter city"
                                    />
                                </Form.Group>
                            </div>

                            {/* <div className="col-md-6 mb-3">
                                <Form.Group controlId="search">
                                    <Form.Label>Search</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="search"
                                        value={filters?.search ?? ''}
                                        onChange={handleFilterChange}
                                        placeholder="Search"
                                    />
                                </Form.Group>
                            </div> */}
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleApplyFilters}>
                        Apply Filters
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    ) : (
        <p style={{ color: 'red', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>
            You do not have permission to view this list.
        </p>
    );
};

export default UserManagement;
