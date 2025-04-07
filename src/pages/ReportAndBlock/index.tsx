// import React, { useEffect, useState } from 'react';
// import { Card, Table } from 'react-bootstrap';
// import { useRedux } from '../../hooks';
// import { reportList } from '../../redux/actions';
// import { RootState } from '../../redux/store';
// import BorderedTable from '../tables/BasicTable/BorderedTable';
// import SoftButton from '../uikit/Buttons/SoftButton';
// import ToggleSwitch from '../../components/ToggleSwitch/index';

// interface User {
//     user_id: string;
//     first_name: string;
//     last_name: string;
//     user_name: string;
//     phone_number: string;
//     country: string;
//     city: string;
//     profile_image: string; // Updated from File to string (URL)
//     dob: string;
// }

// interface Report {
//     report_id: string;
//     reported_user: User;
//     reporter_user: User;
//     description: string;
//     created_at: string;
// }

// const ReportAndBlock = () => {
//     const { dispatch, appSelector } = useRedux();
//     const { reports = {}, loading, error } = appSelector((state: RootState) => state.report);

//     // Extract reports array
//     const reportListData = reports?.data.reports || [];

//     console.log('ReportListData:', reportListData);

//     useEffect(() => {
//         dispatch(reportList());
//     }, [dispatch]);

//     return (
//         <div>
//             {loading && <p>Loading...</p>}
//             {error && <p style={{ color: 'red' }}>{error}</p>}

//             {!loading && (
//                 <BorderedTable
//                     // title={`Reported Users (Total: ${reports.total_reports || 0})`}
//                     title={`Reported Users:`}
//                     // actionButton={
//                     //     <SoftButton variant="primary" onClick={() => console.log('Clicked')}>
//                     //         Add Report
//                     //     </SoftButton>
//                     // }
//                 >
//                     <Table bordered>
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Name</th>
//                                 <th>User Name</th>
//                                 <th>Description</th>
//                                 <th>Phone Number</th>
//                                 <th>City</th>
//                                 <th>Country</th>
//                                 <th>D.O.B</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {reportListData.length > 0 ? (
//                                 reportListData.map((report: Report, index: number) => (
//                                     <tr key={report.report_id}>
//                                         <td>{index + 1}</td>
//                                         <td>
//                                             {report.reported_user.first_name} {report.reported_user.last_name}
//                                         </td>
//                                         <td>{report.reported_user.user_name}</td>
//                                         <td>{report.description}</td>
//                                         <td>{report.reported_user.phone_number}</td>
//                                         <td>{report.reported_user.city}</td>
//                                         <td>{report.reported_user.country}</td>
//                                         <td>{report.reported_user.dob}</td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={5} className="text-center">
//                                         No reports found.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </Table>
//                 </BorderedTable>
//             )}
//         </div>
//     );
// };

// export default ReportAndBlock;

import React, { useEffect, useState } from 'react';
import { Card, Table, Modal, Button } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { reportList } from '../../redux/actions';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';
import { FileText } from 'react-feather';
import { Clipboard } from 'react-feather';
import SoftButton from '../uikit/Buttons/SoftButton';
import ReportReviewModal from './ReviewReportModal';
import { useSelector } from 'react-redux';

interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    phone_number: string;
    country: string;
    city: string;
    profile_image: string; // Updated from File to string (URL)
    dob: string;
}

interface Report {
    report_id: string;
    reported_user: User;
    reporter_user: User;
    description: string;
    created_at: string;
    response: string;
}

type Permission = {
    module_name: string;
    permissions: string; // Stored as a string (e.g., '{read}')
};

const ReportAndBlock = () => {
    const { dispatch, appSelector } = useRedux();
    const { reports = {}, loading, error } = appSelector((state: RootState) => state.report);
    const [showReportReviewModal, setShowReportReviewModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 10;
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // Extract reports array
    const reportListData = reports?.data?.reports || [];
    const pagination = useSelector((state: RootState) => state.report.pagination);

    // const permissions: Permission[] = useSelector((state: RootState) => state.Auth.user.permissions);

    // const userPermission = permissions.find((perm) => perm.module_name === 'Interest');

    // const userPermissionsArray: string[] = userPermission
    //     ? userPermission.permissions.replace(/[{}]/g, '').split(/\s*,\s*/)
    //     : [];
    const permissionsObj = useSelector((state: RootState) => state.Auth.user.data.permissions);
    const userPermissionsArray: string[] = permissionsObj?.Interest || [];

    // State for storing selected reporter details
    const [selectedReporter, setSelectedReporter] = useState<User | null>(null);

    const handleRegisterNewReport = () => {
        if (!showReportReviewModal) {
            setShowReportReviewModal(true);
        }
    };

    const handleCloseRegRepModal = () => {
        setShowReportReviewModal(false);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        dispatch(reportList(currentPage, itemsPerPage));
    }, [dispatch, currentPage]);

    // Function to handle click and set reporter details
    const handleUserClick = (reporter: User) => {
        setSelectedReporter(reporter);
    };

    // Function to close modal
    const closeModal = () => setSelectedReporter(null);

    return userPermissionsArray.includes('read') ? (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && (
                <BorderedTable title="Reported Users:">
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
                                    User Name
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Description
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Phone Number
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    City
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Country
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Age
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Time
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Reporter User
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Response
                                </th>
                                {userPermissionsArray?.includes('update') && (
                                    <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                        Report Review
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {reportListData.length > 0 ? (
                                reportListData.map((report: Report, index: number) => (
                                    <tr key={report.report_id}>
                                        <td>
                                            <img
                                                src={report.reported_user.profile_image}
                                                alt="Profile Image"
                                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                            />
                                        </td>

                                        <td>
                                            {report.reported_user.first_name} {report.reported_user.last_name}
                                        </td>
                                        <td>{report.reported_user.user_name}</td>
                                        <td>{report.description}</td>
                                        <td>{report.reported_user.phone_number}</td>
                                        <td>{report.reported_user.city}</td>
                                        <td>{report.reported_user.country}</td>
                                        <td>{report.reported_user.dob}</td>

                                        <td>{new Date(report.created_at).toLocaleString()}</td>

                                        <td
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleUserClick(report.reporter_user)}>
                                            <FileText size={20} />
                                        </td>
                                        <td>{report.response}</td>
                                        <td>
                                            {userPermissionsArray?.includes('update') && (
                                                <>
                                                    <Clipboard
                                                        size={20}
                                                        onClick={handleRegisterNewReport}
                                                        style={{ cursor: 'pointer' }}
                                                    />

                                                    <ReportReviewModal
                                                        show={showReportReviewModal}
                                                        onClose={handleCloseRegRepModal}
                                                        reportId={report.report_id}
                                                    />
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        No reports found.
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

            {/* Pagination Controls
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
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

            {/* Modal for showing reporter details */}
            <Modal show={!!selectedReporter} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Reporter User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReporter && (
                        <div>
                            <p>
                                <strong>Name:</strong> {selectedReporter.first_name} {selectedReporter.last_name}
                            </p>
                            <p>
                                <strong>Username:</strong> {selectedReporter.user_name}
                            </p>
                            <p>
                                <strong>Phone:</strong> {selectedReporter.phone_number}
                            </p>
                            <p>
                                <strong>City:</strong> {selectedReporter.city}
                            </p>
                            <p>
                                <strong>Country:</strong> {selectedReporter.country}
                            </p>
                            <p>
                                <strong>D.O.B:</strong> {selectedReporter.dob}
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
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

export default ReportAndBlock;
