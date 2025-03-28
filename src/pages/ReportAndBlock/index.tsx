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
import ReportReviewModal from './ReviewReportModal';

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

const ReportAndBlock = () => {
    const { dispatch, appSelector } = useRedux();
    const { reports = {}, loading, error } = appSelector((state: RootState) => state.report);
    const [showReportReviewModal, setShowReportReviewModal] = useState(false);

    // Extract reports array
    const reportListData = reports?.data?.reports || [];

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

    useEffect(() => {
        dispatch(reportList());
    }, [dispatch]);

    // Function to handle click and set reporter details
    const handleUserClick = (reporter: User) => {
        setSelectedReporter(reporter);
    };

    // Function to close modal
    const closeModal = () => setSelectedReporter(null);

    return (
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
                                <th>Report Review</th>
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
                                            <Clipboard size={20} onClick={handleRegisterNewReport} />
                                            <ReportReviewModal
                                                show={showReportReviewModal}
                                                onClose={handleCloseRegRepModal}
                                                reportId={report.report_id}
                                            />
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
    );
};

export default ReportAndBlock;
