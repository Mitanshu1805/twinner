import React, { useEffect, useState } from 'react';
import { useRedux } from '../../hooks';
import { RootState } from '../../redux/store';
import { permissionDelete, permissionList, permissionModuleDelete } from '../../redux/actions';
import { Table, Button } from 'react-bootstrap';
import { FaRegEdit, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import RegisterModule from './AddModule';
import RegisterPermission from './AddPermission';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import SuccessModal from '../../components/SuccessModal';
import { useSelector } from 'react-redux';

const Permissions = () => {
    const { dispatch, appSelector } = useRedux();
    const { permissions = [], loading, error } = appSelector((state: RootState) => state.roles);
    const [showModuleDeleteModal, setShowModuleDeleteModal] = useState(false);
    const [showPermissionDeleteModal, setShowPermissionDeleteModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState<string | null>(null);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState<string | null>(null);
    const [showModuleSuccessModal, setShowModuleSuccessModal] = useState(false);
    const [showPermissionSuccessModal, setShowPermissionSuccessModal] = useState(false);
    const permissionsObj = useSelector((state: RootState) => state.Auth.user.data.permissions);
    const userPermissionsArray: string[] = permissionsObj?.Permissions || [];
    console.log('userPermissionsArray>>>>>>>>', userPermissionsArray);

    useEffect(() => {
        dispatch(permissionList());
    }, [dispatch]);

    const handleAddModule = () => {
        setShowModal(true);
    };
    const handleOpenPermissionModal = (moduleId: string) => {
        setSelectedModuleId(moduleId);
        setShowPermissionModal(true);
    };

    const handleDeleteModule = (module_id: string) => {
        setModuleToDelete(module_id);
        setShowModuleDeleteModal(true);
    };
    const confirmModuleDelete = () => {
        if (moduleToDelete) {
            dispatch(permissionModuleDelete(moduleToDelete));
            setTimeout(() => {
                dispatch(permissionList());
            }, 500);
        }
        setShowModuleDeleteModal(false);
    };

    const handleDeletePermission = (permission_id: string) => {
        setPermissionToDelete(permission_id);
        setShowPermissionDeleteModal(true);
    };

    const confirmPermissionDelete = () => {
        if (permissionToDelete) {
            dispatch(permissionDelete(permissionToDelete));
            setTimeout(() => {
                dispatch(permissionList());
            }, 500);
        }
        setShowPermissionDeleteModal(false);
    };
    return (
        <div className="p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Modules & Permissions</h4>
                {userPermissionsArray.includes('write') && (
                    <Button variant="success" onClick={handleAddModule}>
                        <FaPlus className="me-2" />
                        Add Module
                    </Button>
                )}
            </div>

            {loading ? (
                <p>Loading permissions...</p>
            ) : error ? (
                <p>Error loading permissions: {error}</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Module Name</th>
                            <th>Permissions</th>
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map((module: any, index: number) => (
                            <tr key={module.module_id}>
                                <td>{index + 1}</td>
                                <td className="d-flex justify-content-between align-items-center">
                                    <span>{module.module_name}</span>
                                    <div className="d-flex gap-2">
                                        {userPermissionsArray.includes('delete') && (
                                            <FaTrash
                                                role="button"
                                                className="text-danger"
                                                onClick={() => handleDeleteModule(module.module_id)}
                                                title="Delete Module"
                                            />
                                        )}
                                    </div>
                                    <ConfirmDeleteModal
                                        show={showModuleDeleteModal}
                                        onClose={() => setShowModuleDeleteModal(false)}
                                        onConfirm={confirmModuleDelete}
                                        title="Delete Admin User"
                                        message="Are you sure you want to delete this Module? This action cannot be undone."
                                    />
                                </td>
                                <td>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex flex-column gap-2">
                                            {module.permissions.map((perm: any, i: number) => (
                                                <div
                                                    key={i}
                                                    className="d-flex justify-content-between align-items-center border p-2 rounded">
                                                    <span>{perm.permission_type}</span>
                                                    {userPermissionsArray.includes('delete') && (
                                                        <FaMinus
                                                            role="button"
                                                            className="text-danger"
                                                            title="Remove Permission"
                                                            onClick={() => {
                                                                handleDeletePermission(perm.permission_id);
                                                            }}
                                                            // title="Delete Permission"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            {userPermissionsArray.includes('write') && (
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    className="mt-2 d-flex align-items-center gap-1"
                                                    onClick={() => handleOpenPermissionModal(module.module_id)}>
                                                    <FaPlus /> Add Permission
                                                </Button>
                                            )}
                                        </div>

                                        {selectedModuleId && (
                                            <RegisterPermission
                                                show={showPermissionModal}
                                                onClose={() => setShowPermissionModal(false)}
                                                moduleId={selectedModuleId}
                                                onSuccess={() => {
                                                    dispatch(permissionList());
                                                    setShowPermissionSuccessModal(true);
                                                }}
                                                existingPermissions={
                                                    permissions
                                                        .find(
                                                            (mod: {
                                                                module_id: string;
                                                                permissions: { permission_type: string }[];
                                                            }) => mod.module_id === selectedModuleId
                                                        )
                                                        ?.permissions.map(
                                                            (p: { permission_type: string }) => p.permission_type
                                                        ) || []
                                                }
                                            />
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <RegisterModule
                show={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    dispatch(permissionList());
                    setShowModuleSuccessModal(true);
                }}
            />
            <SuccessModal
                show={showModuleSuccessModal}
                onClose={() => setShowModuleSuccessModal(false)}
                message="Module has been added"
            />
            <SuccessModal
                show={showPermissionSuccessModal}
                onClose={() => setShowPermissionSuccessModal(false)}
                message="Permissions has been added"
            />
            <ConfirmDeleteModal
                show={showPermissionDeleteModal}
                onClose={() => setShowPermissionDeleteModal(false)}
                onConfirm={confirmPermissionDelete}
                title="Delete Permission"
                message="Are you sure you want to delete this Permission? This action cannot be undone."
            />
        </div>
    );
};

export default Permissions;
