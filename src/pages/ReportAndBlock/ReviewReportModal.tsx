import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { reportList, reportReview } from '../../redux/actions';
import { RootState } from '../../redux/store';
import { useRedux } from '../../hooks';

interface ReportReviewModalProps {
    show: boolean;
    onClose: () => void;
    reportId: string;
    onSuccess: () => void;
}

const ReportReviewModal: React.FC<ReportReviewModalProps> = ({ show, onClose, reportId, onSuccess }) => {
    const { dispatch, appSelector } = useRedux();
    const { reports = {}, loading, error } = appSelector((state: RootState) => state.report);
    const reportListData = reports?.data?.reports || [];
    console.log(reportListData);

    const [response, setResponse] = useState('');
    // const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // useEffect(() => {
    //     if (!show) {
    //         setResponse('');
    //     }
    // }, [show]);
    useEffect(() => {
        if (show) {
            console.log('reportListData:', reportListData); // 🐞 Debug
            const report = reportListData.find((r: any) => r.report_id === reportId);
            console.log('matched report:', report); // 🐞 Debug
            setResponse(report?.response || '');
        } else {
            setResponse('');
        }
    }, [show, reportId, reportListData]);

    const handleReport = () => {
        if (response.trim() === '') {
            alert('Please enter a response before reporting.');
            return; // Prevent further execution if response is empty
        }

        const newReport = {
            report_id: reportId,
            response,
        };

        dispatch(reportReview(newReport));

        setTimeout(() => {
            dispatch(reportList(currentPage, itemsPerPage));
            onSuccess();
            onClose();
        }, 500);

        setTimeout(() => {
            dispatch(reportList(currentPage, itemsPerPage)); // Corrected function call
            setResponse('');
            onClose();
        }, 500);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Report Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="response">
                        <Form.Label>Response:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleReport}>
                    Report
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReportReviewModal;
