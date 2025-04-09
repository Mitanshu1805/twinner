// components/SuccessModal.tsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface SuccessModalProps {
    show: boolean;
    onClose?: () => void;
    message: string;
    title?: string;
    onHide?: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ show, onHide, onClose, message, title = 'Success' }) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={onClose}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SuccessModal;
