import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { permissionList, permissionModuleAdd } from '../../redux/actions';

interface AddModuleProps {
    show: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const RegisterModule: React.FC<AddModuleProps> = ({ show, onClose, onSuccess }) => {
    const [module_name, setModuleName] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        if (!show) {
            setModuleName('');
        }
    }, [show]);

    const handleModule = () => {
        if (module_name.trim() === '') {
            alert('Please enter a module name.');
            return;
        }

        const newModule = { module_name };
        dispatch(permissionModuleAdd(newModule));

        setTimeout(() => {
            dispatch(permissionList());
            onSuccess();
            onClose();
        }, 500);
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add New Module</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="moduleName">
                        <Form.Label>Module Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter module name"
                            value={module_name}
                            onChange={(e) => setModuleName(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handleModule}>
                    Save Module
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterModule;
