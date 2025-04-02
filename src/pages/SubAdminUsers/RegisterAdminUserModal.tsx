import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adminUserAdd, adminUserUpdate, adminUserList } from '../../redux/subAdminUser/actions'; // Import Redux actions
import { useRedux } from '../../hooks';
import { RootState } from '../../redux/store';
import { permissionAssign, permissionList } from '../../redux/actions';

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

interface PermissionList {
    module_name: string;
    permissions: Permission[];
}

interface Permission {
    permission_id: number;
    permission_type: string;
}

const RegisterAdminUserModal: React.FC<RegisterAdminUserModalProps> = ({ show, onClose, adminUserToEdit }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { dispatch, appSelector } = useRedux();
    const { permissions = [], loading, error } = appSelector((state: RootState) => state.roles);

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const adminUserId = useSelector((state: RootState) => state.adminUser.admin_user_id);
    console.log('ADMIN USER ID from Redux:', adminUserId);

    // Effect to monitor changes to adminUserId
    // useEffect(() => {
    //     if (adminUserId) {
    //         console.log('New admin user added with ID:', adminUserId);
    //     }
    // }, [adminUserId]); // Will trigger when adminUserId changes

    useEffect(() => {
        if (adminUserToEdit) {
            setFirstName(adminUserToEdit.first_name);
            setLastName(adminUserToEdit.last_name);
            setPhoneNumber(adminUserToEdit.phone_number);
        } else {
            setFirstName('');
            setLastName('');
            setPhoneNumber('');
        }

        if (show) {
            dispatch(permissionList());
        }
    }, [dispatch, show, adminUserToEdit]);

    const handlePermissionChange = (permissionId: number) => {
        setSelectedPermissions(
            (prev) =>
                prev.includes(permissionId)
                    ? prev.filter((id) => id !== permissionId) // Remove if already selected
                    : [...prev, permissionId] // Add if not selected
        );
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const adminUserData = {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
        };

        try {
            let userId = adminUserToEdit?.admin_user_id;
            console.log('userId: ', userId);

            const id = adminUserId || localStorage.getItem('adminUserId');
            console.log('Stored userId (from Redux or localStorage): ', id);

            if (userId) {
                // Update existing admin user
                await dispatch(adminUserUpdate({ ...adminUserData }) as any);
            } else {
                // Register new admin user
                await dispatch(adminUserAdd(adminUserData) as any);
            }

            if (id && selectedPermissions.length > 0) {
                await dispatch(
                    permissionAssign({
                        admin_user_id: id,
                        permission_ids: selectedPermissions.map(String),
                    }) as any
                );
            }

            // Refresh permission list
            dispatch(permissionList());

            // Close the modal
            onClose();
        } catch (error) {
            console.error('Error in form submission: ', error);
        }
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
                    {/* Show permissions only if we're in register mode (no adminUserToEdit) */}
                    {!adminUserToEdit && (
                        <Form.Group className="mb-3">
                            <Form.Label>Select Permissions</Form.Label>
                            {loading ? (
                                <p>Loading permissions...</p>
                            ) : (
                                <Accordion>
                                    {permissions.map((module: PermissionList, index: number) => (
                                        <Accordion.Item eventKey={index.toString()} key={index}>
                                            <Accordion.Header>{module.module_name}</Accordion.Header>
                                            <Accordion.Body>
                                                {module.permissions.map((perm: Permission) => (
                                                    <Form.Check
                                                        key={perm.permission_id}
                                                        type="checkbox"
                                                        label={perm.permission_type}
                                                        checked={selectedPermissions.includes(perm.permission_id)}
                                                        onChange={() => handlePermissionChange(perm.permission_id)}
                                                    />
                                                ))}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            )}
                        </Form.Group>
                    )}

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
