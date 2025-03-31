import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { reportList, reportReview } from '../../redux/actions';

interface ReportReviewModalProps {
    show: boolean;
    onClose: () => void;
    reportId: string;
}

const ReportReviewModal: React.FC<ReportReviewModalProps> = ({ show, onClose, reportId }) => {
    const [response, setResponse] = useState('');
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!show) {
            setResponse('');
        }
    }, [show]);

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
