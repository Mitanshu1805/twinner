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
import SuccessModal from '../../components/SuccessModal';

interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    phone_number: string;
    country: string;
    city: string;
    profile_image: string;
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
    permissions: string;
};

const ReportAndBlock = () => {
    const { dispatch, appSelector } = useRedux();
    const { reports = {}, loading, error } = appSelector((state: RootState) => state.report);
    console.log('reports>>>>>>', reports);

    const [showReportReviewModal, setShowReportReviewModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    // const itemsPerPage = 10;
    const [itemsPerPage, setItemsPerPage] = useState(10);
    // Extract reports array
    const reportListData = reports?.data?.reports || [];
    const pagination = useSelector((state: RootState) => state.report.pagination);
    const [showReportSuccessModal, setShowReportSuccessModal] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const permissionsObj = useSelector((state: RootState) => state.Auth.user.data.permissions);
    const userPermissionsArray: string[] = permissionsObj?.Report || [];

    const [selectedReporter, setSelectedReporter] = useState<User | null>(null);

    const handleRegisterNewReport = (reportId: string) => {
        setSelectedReportId(reportId);
        setShowReportReviewModal(true);
    };

    const handleCloseRegRepModal = () => {
        setShowReportReviewModal(false);
        setSelectedReportId(null);
    };
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    useEffect(() => {
        dispatch(reportList(currentPage, itemsPerPage));
    }, [dispatch, currentPage]);

    const handleUserClick = (reporter: User) => {
        setSelectedReporter(reporter);
    };

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
                                <th>Profile Image</th>
                                <th>Name</th>
                                <th>User Name</th>
                                <th>Description</th>
                                <th>Phone Number</th>
                                <th>City</th>
                                <th>Country</th>
                                <th>Age</th>
                                <th>Time</th>
                                <th>Reporter User</th>
                                <th>Response</th>
                                {userPermissionsArray?.includes('update') && <th>Report Review</th>}
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
                                                        onClick={() => handleRegisterNewReport(report.report_id)}
                                                        style={{ cursor: 'pointer' }}
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
            <ReportReviewModal
                show={showReportReviewModal}
                onClose={handleCloseRegRepModal}
                reportId={selectedReportId!}
                onSuccess={() => {
                    dispatch(reportList(currentPage, itemsPerPage));
                    setShowReportSuccessModal(true);
                }}
            />
            <SuccessModal
                show={showReportSuccessModal}
                onClose={() => setShowReportSuccessModal(false)}
                message="Your report has been submitted"
            />
        </div>
    ) : (
        <p style={{ color: 'red', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>
            You do not have permission to view this list.
        </p>
    );
};

export default ReportAndBlock;
