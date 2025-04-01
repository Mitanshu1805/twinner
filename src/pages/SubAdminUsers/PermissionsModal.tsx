import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Accordion } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRedux } from '../../hooks';
import { RootState } from '../../redux/store';
import { permissionAssign, permissionList } from '../../redux/actions';

interface PermissionList {
    module_name: string;
    permissions: Permission[];
}

interface Permission {
    permission_id: number;
    permission_type: string;
}

interface PermissionsModalProps {
    show: boolean;
    onClose: () => void;
    user?: { first_name: string; last_name: string; admin_user_id: string; permissions: Permission[] };
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ show, onClose, user }) => {
    const { dispatch, appSelector } = useRedux();
    const { permissions = [], loading, error } = appSelector((state: RootState) => state.roles);
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const isFetched = useRef(false);

    // Handle changes to permissions checkboxes
    const handlePermissionChange = (permissionId: number) => {
        setSelectedPermissions(
            (prev) =>
                prev.includes(permissionId)
                    ? prev.filter((id) => id !== permissionId) // Remove if already selected
                    : [...prev, permissionId] // Add if not selected
        );
    };

    useEffect(() => {
        if (show && !isFetched.current) {
            dispatch(permissionList());
            isFetched.current = true;
        }

        if (user) {
            // Pre-fill selectedPermissions when user is passed
            const userPermissions = user.permissions.map((perm) => perm.permission_id);

            setSelectedPermissions(userPermissions);
        }
    }, [show, user, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            console.error('User not found');
            return;
        }

        const payload = {
            admin_user_id: user.admin_user_id, // Assuming user has admin_user_id
            permission_ids: selectedPermissions.map(String), // Convert to string array
        };

        dispatch(permissionAssign(payload));
        console.log('Assigning permissions:', payload);

        onClose(); // Close the modal after submission
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>Permissions</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
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
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            {user ? 'Update' : 'Register'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PermissionsModal;
