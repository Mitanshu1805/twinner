import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { supportHelpList, supportHelpReview } from '../../redux/actions';

interface SupportReviewModalProps {
    show: boolean;
    onClose: () => void;
    helpId: string;
}

const SupportReviewModal: React.FC<SupportReviewModalProps> = ({ show, onClose, helpId }) => {
    const [response, setResponse] = useState('');
    const dispatch = useDispatch();
    const [currentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!show) {
            setResponse('');
        }
    }, [show]);

    const handleReport = () => {
        const newReport = {
            help_center_id: helpId,
            response,
        };

        dispatch(supportHelpReview(newReport));

        setTimeout(() => {
            dispatch(supportHelpList(currentPage, itemsPerPage));
            setResponse('');
            onClose();
        }, 500);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Review Support Help</Modal.Title>
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
                <Button variant="primary" onClick={handleReport} disabled={!response.trim()}>
                    Report
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SupportReviewModal;
