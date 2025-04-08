import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { permissionList, permissionAdd } from '../../redux/actions';

interface AddPermissionProps {
    show: boolean;
    onClose: () => void;
    moduleId: string;
    existingPermissions: string[];
    onSuccess: () => void;
}

const permissionOptions = ['read', 'write', 'update', 'delete'];

const RegisterPermission: React.FC<AddPermissionProps> = ({
    show,
    onClose,
    moduleId,
    existingPermissions,
    onSuccess,
}) => {
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     if (!show) {
    //         setSelectedPermissions([]);
    //     }
    // }, [show]);
    useEffect(() => {
        if (show) {
            setSelectedPermissions(existingPermissions);
        } else {
            setSelectedPermissions([]);
        }
    }, [show, existingPermissions]);

    const handleCheckboxChange = (permission: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permission) ? prev.filter((perm) => perm !== permission) : [...prev, permission]
        );
    };

    const handlePermission = () => {
        if (selectedPermissions.length === 0) {
            alert('Please select at least one permission.');
            return;
        }

        const newPermissions = selectedPermissions.map((type) => ({
            permission_type: type,
            module_id: moduleId,
        }));

        newPermissions.forEach((perm) => dispatch(permissionAdd(perm)));

        setTimeout(() => {
            dispatch(permissionList());
            onSuccess();
            onClose();
        }, 500);
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Permission</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>Select Permissions</Form.Label>

                    <Form.Check
                        type="checkbox"
                        label="Select All"
                        checked={selectedPermissions.length === permissionOptions.length}
                        onChange={() => {
                            if (selectedPermissions.length === permissionOptions.length) {
                                setSelectedPermissions([]);
                            } else {
                                setSelectedPermissions([...permissionOptions]);
                            }
                        }}
                        className="mb-2"
                    />

                    {permissionOptions.map((perm) => (
                        <Form.Check
                            key={perm}
                            type="checkbox"
                            label={perm.charAt(0).toUpperCase() + perm.slice(1)}
                            checked={selectedPermissions.includes(perm)}
                            onChange={() => handleCheckboxChange(perm)}
                        />
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={handlePermission}>
                    Save Permission
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterPermission;
