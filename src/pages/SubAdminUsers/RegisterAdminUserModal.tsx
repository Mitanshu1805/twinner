import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { adminUserAdd, adminUserUpdate } from '../../redux/subAdminUser/actions'; // Import Redux actions

interface AdminUser {
    admin_user_id?: string;
    first_name: string;
    last_name: string;
    user_name: string;
    phone_number: string; // Changed from number to string
    // is_active: boolean;
}

interface RegisterAdminUserModalProps {
    show: boolean;
    onClose: () => void;
    adminUserToEdit?: AdminUser | null;
}

const RegisterAdminUserModal: React.FC<RegisterAdminUserModalProps> = ({ show, onClose, adminUserToEdit }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isActive, setIsActive] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (adminUserToEdit) {
            setFirstName(adminUserToEdit.first_name);
            setLastName(adminUserToEdit.last_name);
            setUserName(adminUserToEdit.user_name);
            setPhoneNumber(adminUserToEdit.phone_number); // Now handled as a string
            // setIsActive(adminUserToEdit.is_active);
        } else {
            setFirstName('');
            setLastName('');
            setUserName('');
            setPhoneNumber('');
            // setIsActive(false);
        }
    }, [show, adminUserToEdit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const adminUserData = {
            first_name: firstName,
            last_name: lastName,
            user_name: userName,
            phone_number: phoneNumber, // Now it's a string
            // is_active: isActive,
        };

        if (adminUserToEdit?.admin_user_id) {
            // Editing an existing user: Ensure correct type
            dispatch(
                adminUserUpdate({
                    admin_user_id: adminUserToEdit.admin_user_id, // Pass separately
                    ...adminUserData,
                } as any)
            ); // Quick Fix (Temporary Type Override)
        } else {
            // Adding a new user: Ensure admin_user_id is NOT included
            dispatch(adminUserAdd(adminUserData));
        }

        onClose(); // Close modal after submitting
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{adminUserToEdit ? 'Edit Admin User' : 'Register New Admin User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text" // Changed from number to text input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Active"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                        />
                    </Form.Group> */}

                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {adminUserToEdit ? 'Update' : 'Register'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterAdminUserModal;
