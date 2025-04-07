import React, { useEffect, useState } from 'react';
import { Table, Modal, Button, Pagination } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { supportHelpList } from '../../redux/actions';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';
import SoftButton from '../uikit/Buttons/SoftButton';
import { useSelector } from 'react-redux';
import { Clipboard } from 'react-feather';
import HelpReviewModal from './HelpReviewModal';

interface Help {
    help_center_id: string;
    name: string;
    email: string;
    description: string;
    user: User | null;
    created_at: string;
    response: string;
}

interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    phone_number: string;
    country: string;
    city: string;
    profile_image: string;
}

type Permission = {
    module_name: string;
    permissions: string; // Stored as a string (e.g., '{read}')
};

const HelpAndSupport = () => {
    const { dispatch, appSelector } = useRedux();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { helpAndSupports = [], loading, error } = appSelector((state: RootState) => state.report);
    const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 10;
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const itemsPerPageFixed = Number(itemsPerPage).toString(); // Ensure it's a clean number string

    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const paginatedUsers = helpAndSupports.slice(startIndex, startIndex + itemsPerPage);

    const paginatedUsers = helpAndSupports;

    console.log('paginated users', paginatedUsers);
    const [showHelpReportReviewModal, setShowHelpReportReviewModal] = useState(false);
    const pagination = useSelector((state: RootState) => state.report.pagination);
    console.log('pagination>>>>>>: ', pagination);
    // const permissions: Permission[] = useSelector((state: RootState) => state.Auth.user.permissions);

    // // Find the user's permission object for the "User" module
    // const userPermission = permissions.find((perm) => perm.module_name === 'Help');

    // // Ensure the permission string is cleaned and parsed correctly
    // const userPermissionsArray: string[] = userPermission
    //     ? userPermission.permissions.replace(/[{}]/g, '').split(/\s*,\s*/)
    //     : [];
    const permissionsObj = useSelector((state: RootState) => state.Auth.user.data.permissions);
    const userPermissionsArray: string[] = permissionsObj?.Interest || [];

    // console.log('Raw Permissions:', userPermission?.permissions);
    console.log('Parsed Permissions Array:', userPermissionsArray);
    console.log("Includes 'read'?", userPermissionsArray.includes('read'));

    // const {
    //     help_requests = [],
    //     current_page,
    //     total_pages,
    //     loading,
    //     error,
    // } = useSelector((state: RootState) => state.report);
    // console.log('help requests', help_requests);

    // useEffect(() => {
    //     dispatch(supportHelpList());
    // }, [dispatch]);
    useEffect(() => {
        // console.log('Current Page Changed:', currentPage);
        // console.log('Items Page Changed:', itemsPerPage);
        console.log('Dispatching supportHelpList with:', currentPage, itemsPerPage);
        dispatch(supportHelpList(currentPage, itemsPerPage));
    }, [dispatch, currentPage]);

    useEffect(() => {
        console.log('Selected User Changed:', selectedUser);
    }, [selectedUser]);

    const handleUserSelection = (user: User | null) => {
        if (user) {
            console.log('Clicked User:', user);
            setSelectedUser(user);
        }
    };

    // const handleNextPage = () => {
    //     if (currentPage < total_pages) {
    //         setCurrentPage((prev) => prev + 1);
    //     }
    // };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleReviewHelpReport = () => {
        if (!showHelpReportReviewModal) {
            setShowHelpReportReviewModal(true);
        }
    };

    const handleCloseHelpReviewModal = () => {
        setShowHelpReportReviewModal(false);
    };

    return userPermissionsArray.includes('read') ? (
        <div>
            {loading && <p>Loading...</p>}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {!loading && (
                <BorderedTable title="Help & Support">
                    <Table bordered>
                        <thead>
                            <tr>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Profile Image
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Name
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Description
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Email
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Created At
                                </th>
                                {userPermissionsArray?.includes('update') && (
                                    <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                        Add Response
                                    </th>
                                )}
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Response
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.length > 0 ? (
                                paginatedUsers.map((help: Help) => (
                                    <tr key={help.help_center_id}>
                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                onClick={() => {
                                                    console.log('Clicked user:', help.user); // 🔥 Debugging Log
                                                    if (help.user) {
                                                        setSelectedUser(help.user);
                                                    }
                                                }}
                                                src={help.user?.profile_image ?? '/default-profile.jpg'}
                                                alt={help.name}
                                                width="40"
                                                height="40"
                                                style={{ borderRadius: '50%', cursor: 'pointer' }}
                                            />
                                        </td>

                                        <td>{help.name}</td>

                                        <td>{help.description}</td>
                                        <td>{help.email}</td>
                                        {/* <td>{help.created_at}</td> */}
                                        <td>{new Date(help.created_at).toLocaleString()}</td>

                                        <td>
                                            {userPermissionsArray?.includes('update') && (
                                                // <input
                                                //     type="text"
                                                //     value={help.response}
                                                <>
                                                    <Clipboard
                                                        size={20}
                                                        onClick={handleReviewHelpReport}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                    <HelpReviewModal
                                                        show={showHelpReportReviewModal}
                                                        onClose={handleCloseHelpReviewModal}
                                                        helpId={help.help_center_id}
                                                    />
                                                </>
                                            )}
                                        </td>
                                        <td>{help.response}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        No Help Requests Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </BorderedTable>
            )}

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

            {/* User Details Modal */}
            <Modal show={selectedUser !== null} onHide={() => setSelectedUser(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <p>
                                <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
                            </p>
                            <p>
                                <strong>Username:</strong> {selectedUser.user_name}
                            </p>
                            <p>
                                <strong>Phone:</strong> {selectedUser.phone_number}
                            </p>
                            <p>
                                <strong>Country:</strong> {selectedUser.country}
                            </p>
                            <p>
                                <strong>City:</strong> {selectedUser.city}
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                        Close
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

export default HelpAndSupport;
