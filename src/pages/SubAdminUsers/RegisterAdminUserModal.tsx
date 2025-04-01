import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adminUserAdd, adminUserUpdate, adminUserList } from '../../redux/subAdminUser/actions'; // Import Redux actions
import { useRedux } from '../../hooks';
import { RootState } from '../../redux/store';
import { permissionList } from '../../redux/actions';

interface AdminUser {
    admin_user_id?: string;
    first_name: string;
    last_name: string;

    phone_number: string;

}

interface RegisterAdminUserModalProps {
    show: boolean;
    onClose: () => void;
    adminUserToEdit?: AdminUser | null;
}

const RegisterAdminUserModal: React.FC<RegisterAdminUserModalProps> = ({ show, onClose, adminUserToEdit }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isActive, setIsActive] = useState(false);
    const { dispatch, appSelector } = useRedux();
    const { permissions = [], loading, error } = appSelector((state: RootState) => state.roles);
    console.log('Permissions: ', permissions);



    useEffect(() => {
        if (adminUserToEdit) {
            setFirstName(adminUserToEdit.first_name);
            setLastName(adminUserToEdit.last_name);

            setPhoneNumber(adminUserToEdit.phone_number);
        } else {
            setFirstName('');
            setLastName('');

            setPhoneNumber('')
        }

        if (show) {
            dispatch(permissionList());
        }
    }, [dispatch, show, adminUserToEdit]);



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const adminUserData = {
            first_name: firstName,
            last_name: lastName,

            phone_number: phoneNumber,

        };

        if (adminUserToEdit?.admin_user_id) {

            dispatch(
                adminUserUpdate({
                    admin_user_id: adminUserToEdit.admin_user_id,
                    ...adminUserData,
                } as any)
            );
        } else {

            dispatch(adminUserAdd(adminUserData));
        }

        setTimeout(() => {
            console.log("Dispatching permissionList...");
            dispatch(permissionList());
            console.log("Dispatched!");

            onClose();
        }, 500);

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
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text" // Changed from number to text input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </Form.Group>


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
