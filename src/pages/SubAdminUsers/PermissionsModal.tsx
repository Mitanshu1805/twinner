import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { RootState } from '../../redux/store';
import { Row, Col } from 'react-bootstrap';

import { permissionAssign, permissionList } from '../../redux/actions';

interface PermissionList {
    module_name: string;
    permissions: Permission[];
}

interface Permission {
    permission_id: number;
    permission_type: string;
}

interface UserPermission {
    module: string;
    permission: string[];
}

interface User {
    first_name: string;
    last_name: string;
    admin_user_id: string;
    permissions: UserPermission[];
}

interface PermissionsModalProps {
    show: boolean;
    onClose: () => void;
    user?: User;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({ show, onClose, user }) => {
    const { dispatch, appSelector } = useRedux();
    const { permissions = [], loading } = appSelector((state: RootState) => state.roles);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const isFetched = useRef(false);

    useEffect(() => {
        if (show) {
            dispatch(permissionList());
            isFetched.current = true;
        }
    }, [show, dispatch]);

    useEffect(() => {
        if (!user || !user.permissions || permissions.length === 0) {
            console.warn('User or user.permissions is missing. Skipping.');
            setSelectedPermissions([]);
            return;
        }

        console.log('User Permissions from API:', JSON.stringify(user.permissions, null, 2));

        const userPermissions: string[] = user.permissions
            .flatMap((module) => {
                if (!module || !module.module || !module.permission) {
                    console.warn('Invalid user permission structure:', module);
                    return [];
                }

                return module.permission.map((perm: string) => {
                    console.log(`Checking module: ${module.module}, permission: ${perm}`);

                    const matchingModule = permissions.find((p: PermissionList) => p.module_name === module.module);

                    if (!matchingModule) {
                        console.warn(`Module ${module.module} not found in permissions list`);
                        return null;
                    }

                    const matchingPermission = matchingModule.permissions.find(
                        (p: Permission) => p.permission_type === perm
                    );

                    if (!matchingPermission) {
                        console.warn(`Permission ${perm} not found in module ${module.module}`);
                        return null;
                    }

                    return `${module.module}-${matchingPermission.permission_id}`;
                });
            })
            .flat()
            .filter((perm): perm is string => perm !== null);

        console.log('Final Selected Permissions:', userPermissions);
        setSelectedPermissions(userPermissions);
    }, [user, permissions]);

    const handlePermissionChange = (permissionKey: string) => {
        setSelectedPermissions((prev) =>
            prev.includes(permissionKey) ? prev.filter((id) => id !== permissionKey) : [...prev, permissionKey]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            console.error('User not found');
            return;
        }

        const payload = {
            admin_user_id: user.admin_user_id,
            permission_ids: selectedPermissions.map((perm) => perm.split('-')[1]),
        };

        dispatch(permissionAssign(payload));
        console.log('Assigning permissions:', payload);

        onClose();
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                onClose();
                isFetched.current = false;
            }}
            size="lg"
            centered>
            <Modal.Header closeButton style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <Modal.Title style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Manage Permissions</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold" style={{ fontSize: '1.1rem', color: '#495057' }}>
                            Select Permissions
                        </Form.Label>
                        {loading ? (
                            <p className="text-muted">Loading permissions...</p>
                        ) : (
                            <div className="p-2">
                                {permissions.map((module: PermissionList, index: number) => (
                                    <div key={index} className="mb-3">
                                        <h5
                                            className="mb-2 fw-semibold"
                                            style={{
                                                fontSize: '1.2rem',
                                                color: '#343a40',
                                                borderBottom: '1px solid #dee2e6',
                                                paddingBottom: '4px',
                                            }}>
                                            {module.module_name}
                                        </h5>
                                        <Row className="g-2">
                                            {module.permissions.map((perm: Permission) => (
                                                <Col md={3} sm={6} xs={12} key={perm.permission_id}>
                                                    <div
                                                        className="p-2 rounded"
                                                        style={{
                                                            background: selectedPermissions.includes(
                                                                perm.permission_id.toString()
                                                            )
                                                                ? '#e9f5ff'
                                                                : '#f8f9fa',
                                                            border: '1px solid #dee2e6',
                                                        }}>
                                                        <Form.Check
                                                            type="checkbox"
                                                            label={perm.permission_type}
                                                            checked={selectedPermissions.includes(
                                                                `${module.module_name}-${perm.permission_id}`
                                                            )}
                                                            onChange={() =>
                                                                handlePermissionChange(
                                                                    `${module.module_name}-${perm.permission_id}`
                                                                )
                                                            }
                                                            style={{ fontSize: '1rem' }}
                                                        />
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PermissionsModal;
