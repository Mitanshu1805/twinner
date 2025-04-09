import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { RootState } from '../../redux/store';
import { Row, Col } from 'react-bootstrap';
import { adminUserList } from '../../redux/actions';
import { permissionAssign, permissionList } from '../../redux/actions';

interface PermissionList {
    module_name: string;
    permissions: Permission[];
}

interface Permission {
    permission_id: string;
    permission_type: string;
}

interface UserPermission {
    module: string;
    permission: any[];
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
    // console.log('Permissions:>>>>>>> ', permissions);
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const isFetched = useRef(false);

    useEffect(() => {
        if (show) {
            dispatch(permissionList());
            isFetched.current = true;
        }
    }, [show, dispatch]);
    // console.log('user has permissions>>>>', user);

    useEffect(() => {
        if (!user || !user.permissions || permissions.length === 0) {
            // console.warn('User or user.permissions is missing. Skipping.');
            setSelectedPermissions([]);
            return;
        }

        // console.log('User Permissions from API:', JSON.stringify(user.permissions, null, 2));

        const userPermissions: string[] = user.permissions
            .flatMap((module) => {
                if (!module || !module.module || !module.permission) {
                    // console.warn('Invalid user permission structure:', module);
                    return [];
                }

                return module.permission.map((perm: string) => {
                    // console.log(`Checking module: ${module.module}, permission: ${perm}`);

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

                    // return `${module.module}-${matchingPermission.permission_id}`;
                    return `${matchingPermission.permission_id}`;
                });
            })
            .flat()
            .filter((perm): perm is string => perm !== null);

        // console.log('Final Selected Permissions:', userPermissions);
        setSelectedPermissions(userPermissions);
    }, [user, permissions]);

    // const handlePermissionChange = (permissionKey: string) => {
    //     setSelectedPermissions((prev) =>
    //         prev.includes(permissionKey) ? prev.filter((id) => id !== permissionKey) : [...prev, permissionKey]
    //     );
    // };
    const handlePermissionChange = (permissionId: string, module: PermissionList, permType: string) => {
        const updated = new Set(selectedPermissions);

        const isChecked = updated.has(permissionId);

        const readPermission = module.permissions.find((p) => p.permission_type.toLowerCase() === 'read');

        if (isChecked) {
            // Uncheck the clicked permission
            updated.delete(permissionId);

            // If "read" is unchecked, uncheck all other permissions of the module
            if (permType.toLowerCase() === 'read') {
                module.permissions.forEach((p) => updated.delete(p.permission_id));
            }
        } else {
            // Check the clicked permission
            updated.add(permissionId);

            // If not "read", auto-check "read"
            if (
                ['update', 'delete', 'write'].includes(permType.toLowerCase()) &&
                readPermission &&
                !updated.has(readPermission.permission_id)
            ) {
                updated.add(readPermission.permission_id);
            }
        }

        setSelectedPermissions(Array.from(updated));
    };
    // console.log('Selection Permissions', selectedPermissions);
    const handleSelectAll = () => {
        if (selectedPermissions.length === permissions.flatMap((p: any) => p.permissions).length) {
            // If all are already selected, unselect all
            setSelectedPermissions([]);
        } else {
            // Else, select all
            const allPermissionIds = permissions.flatMap((p: any) =>
                p.permissions.map((perm: any) => perm.permission_id)
            );
            setSelectedPermissions(allPermissionIds);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            console.error('User not found');
            return;
        }

        const payload = {
            admin_user_id: user.admin_user_id,

            permission_ids: selectedPermissions,
        };

        dispatch(permissionAssign(payload));
        console.log('Assigning permissions:', payload);

        onClose();

        setTimeout(() => {
            dispatch(adminUserList(currentPage, itemsPerPage));
        });
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                onClose();
                // isFetched.current = false;
            }}
            size="lg"
            centered>
            <Modal.Header closeButton style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <Modal.Title style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Manage Permissions</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* <Form onSubmit={handleSubmit}> */}
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold" style={{ fontSize: '1.1rem', color: '#495057' }}>
                        Select Permissions
                    </Form.Label>
                    {loading ? (
                        <p className="text-muted">Loading permissions...</p>
                    ) : (
                        <div className="p-2">
                            <Button
                                variant="outline-primary"
                                className="mb-3"
                                onClick={handleSelectAll}
                                style={{ fontWeight: '500' }}>
                                {selectedPermissions.length === permissions.flatMap((p: any) => p.permissions).length
                                    ? 'Deselect All'
                                    : 'Select All'}
                            </Button>

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
                                                    // onClick={() => handlePermissionChange(`${perm.permission_id}`)}
                                                    onClick={() =>
                                                        handlePermissionChange(
                                                            perm.permission_id,
                                                            module,
                                                            perm.permission_type
                                                        )
                                                    }
                                                    style={{
                                                        background: '#f8f9fa',
                                                        border: '1px solid #dee2e6',
                                                    }}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        label={perm.permission_type}
                                                        checked={selectedPermissions.includes(`${perm.permission_id}`)}
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
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
                {/* </Form> */}
            </Modal.Body>
        </Modal>
    );
};

export default PermissionsModal;
