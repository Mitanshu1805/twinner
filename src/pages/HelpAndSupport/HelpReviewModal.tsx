import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { supportHelpList, supportHelpReview } from '../../redux/actions';
import { RootState } from '../../redux/store';
import { useRedux } from '../../hooks';

interface SupportReviewModalProps {
    show: boolean;
    onClose: () => void;
    helpId: string;
    onSuccess: () => void;
}

const SupportReviewModal: React.FC<SupportReviewModalProps> = ({ show, onClose, helpId, onSuccess }) => {
    const [response, setResponse] = useState('');
    const { dispatch, appSelector } = useRedux();
    const [currentPage] = useState(1);
    const itemsPerPage = 10;
    const { helpAndSupports = [], loading, error } = appSelector((state: RootState) => state.report);

    useEffect(() => {
        if (!show) {
            setResponse('');
            return;
        }

        const help = helpAndSupports.find((h: any) => h.help_center_id === helpId);
        console.log('help>>>>', help);
        setResponse(help?.response || '');
    }, [show, helpId]); // ✅ remove helpAndSupports from dependency

    const handleReport = () => {
        const newReport = {
            help_center_id: helpId,
            response,
        };

        dispatch(supportHelpReview(newReport));

        setTimeout(() => {
            dispatch(supportHelpList(currentPage, itemsPerPage));
            setResponse('');
            onSuccess();
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
                <Button variant="primary" onClick={handleReport}>
                    Report
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SupportReviewModal;
