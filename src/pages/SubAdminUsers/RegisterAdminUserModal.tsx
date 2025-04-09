import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Accordion } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { adminUserAdd, adminUserUpdate, adminUserList } from '../../redux/subAdminUser/actions'; // Import Redux actions
import { useRedux } from '../../hooks';
import { Row, Col } from 'react-bootstrap';
import { RootState } from '../../redux/store';
import { permissionAssign, permissionList } from '../../redux/actions';
import 'react-phone-input-2/lib/bootstrap.css';
import PhoneInput from 'react-phone-input-2';

interface AdminUser {
    admin_user_id?: string;
    first_name: string;
    last_name: string;

    phone_number: string;
}

interface RegisterAdminUserModalProps {
    show: boolean;
    onClose: () => void;
    onSuccess: (isUpdate: boolean) => void;
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

const RegisterAdminUserModal: React.FC<RegisterAdminUserModalProps> = ({
    show,
    onClose,
    adminUserToEdit,
    onSuccess,
}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { dispatch, appSelector } = useRedux();
    const { permissions = [], loading, error } = appSelector((state: RootState) => state.roles);
    const [allSelected, setAllSelected] = useState(false);
    // const userAddError = useSelector((state: RootState) => state.adminUser?.error);

    const { error: userAddError, success } = useSelector((state: RootState) => state.adminUser);
    console.log('userAddError>>>>>>>', userAddError);
    const [apiError, setApiError] = useState('');
    // Add these new states
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

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

    const handleToggleAllPermissions = () => {
        if (allSelected) {
            setSelectedPermissions([]);
        } else {
            const allPermissionIds = permissions.flatMap((module: PermissionList) =>
                module.permissions.map((perm: Permission) => perm.permission_id)
            );
            setSelectedPermissions(allPermissionIds);
        }
        setAllSelected(!allSelected);
    };

    const handlePermissionChange = (permissionId: number, module: PermissionList, permType: string) => {
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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset errors
        setFirstNameError('');
        setLastNameError('');
        setPhoneError('');

        let hasError = false;

        // Validation
        if (!firstName.trim()) {
            setFirstNameError('First name is required');
            hasError = true;
        }
        if (!lastName.trim()) {
            setLastNameError('Last name is required');
            hasError = true;
        }
        // if (!/^\+91\d{10}$/.test(phoneNumber)) {
        //     setPhoneError('Enter a valid 10-digit Indian phone number');
        //     hasError = true;
        // }

        if (hasError) return;

        const adminUserData = {
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
            admin_user_id: adminUserToEdit?.admin_user_id,
        };

        try {
            let userId = adminUserToEdit?.admin_user_id;

            if (userId) {
                await dispatch(adminUserUpdate({ ...adminUserData }) as any);
            } else {
                await dispatch(adminUserAdd(adminUserData) as any);
            }

            setTimeout(() => {
                const storedAdminUserId = localStorage.getItem('adminUserId');

                if (storedAdminUserId && selectedPermissions.length > 0) {
                    dispatch(
                        permissionAssign({
                            admin_user_id: storedAdminUserId,
                            permission_ids: selectedPermissions.map(String),
                        }) as any
                    );
                }

                dispatch(permissionList());
                localStorage.removeItem('adminUserId');

                // onSuccess(!!adminUserToEdit);
                // onClose();
            }, 1000);
        } catch (error) {
            console.error('Error in form submission: ', error);
        }
    };

    useEffect(() => {
        if (userAddError) {
            setApiError(userAddError);
        }

        if (success && show) {
            onSuccess(!!adminUserToEdit);
            onClose();
        }
    }, [userAddError, success]);

    // useEffect(() => {
    //     if (userAddError) {
    //         setApiError(userAddError);
    //     } else if (userAddError === null && show) {
    //         onSuccess(!!adminUserToEdit);
    //         onClose();
    //     }
    // }, [userAddError]);

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                <Modal.Title style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                    {adminUserToEdit ? 'Edit Admin User' : 'Register New Admin User'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {userAddError && (
                    <div className="alert alert-danger text-center" role="alert">
                        {apiError}
                    </div>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            isInvalid={!!firstNameError}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{firstNameError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            isInvalid={!!lastNameError}
                            required
                        />
                        <Form.Control.Feedback type="invalid">{lastNameError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <PhoneInput
                            country={'ae'}
                            value={phoneNumber}
                            onChange={(value) => setPhoneNumber('+' + value.replace(/\D/g, ''))}
                            inputStyle={{ width: '100%' }}
                            inputProps={{ name: 'phone_number', required: true, autoComplete: 'tel' }}
                            specialLabel=""
                            inputClass={phoneError ? 'is-invalid' : ''}
                        />
                        {phoneError && <div className="invalid-feedback d-block">{phoneError}</div>}
                    </Form.Group>

                    {!adminUserToEdit && (
                        <Form.Group className="mb-3">
                            <Row className="align-items-center mb-2">
                                <Col>
                                    <Form.Label
                                        className="fw-bold mb-0"
                                        style={{ fontSize: '1.1rem', color: '#495057' }}>
                                        Select Permissions
                                    </Form.Label>
                                </Col>
                                <Col className="text-end">
                                    <Button
                                        variant={allSelected ? 'danger' : 'success'}
                                        size="sm"
                                        onClick={handleToggleAllPermissions}>
                                        {allSelected ? 'Deselect All' : 'Select All'}
                                    </Button>
                                </Col>
                            </Row>

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
                                                                checked={selectedPermissions.includes(
                                                                    perm.permission_id
                                                                )}
                                                                onClick={() =>
                                                                    handlePermissionChange(
                                                                        perm.permission_id,
                                                                        module,
                                                                        perm.permission_type
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
