import React, { useEffect, useState } from 'react';
import { useRedux } from '../../hooks';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { versionList, versionUpdate } from '../../redux/actions';
import ToggleSwitch from '../../components/ToggleSwitch/index';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import UpdateAppModal from './UpdateAppModal';
import SuccessModal from '../../components/SuccessModal';

interface VersionList {
    app_version_id: string;
    os: string;
    version: string;
    is_force_update: boolean;
    updated_at: string;
}

interface VersionUpdateProps {
    app_version_id: string;
    version: string;
    is_force_update: boolean;
}

const AppUpdates = () => {
    const { dispatch } = useRedux();

    const versionListData = useSelector((state: RootState) => state.appUpdates?.versionList?.data || []);
    const [selectedVerison, setSelectedVerison] = useState<VersionUpdateProps | null>(null);
    const [showVersionUpdateModal, setShowVersionUpdateModal] = useState(false);
    const [showVersionUpdateSuccessModal, setShowVersionUpdateSuccessModal] = useState(false);
    const permissionsObj = useSelector((state: RootState) => state.Auth.user.data.permissions);
    const userPermissionsArray: string[] = permissionsObj?.Updates || [];
    console.log('userPermissionsArray>>>>>', userPermissionsArray);

    useEffect(() => {
        dispatch(versionList());
    }, [dispatch]);

    const handleUpdateVersion = (versionUpdate: VersionUpdateProps) => {
        setSelectedVerison(versionUpdate);
        setShowVersionUpdateModal(true);
    };

    return userPermissionsArray.includes('read') ? (
        <div>
            <h4 className="mb-3">App Version List</h4>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>OS</th>
                        <th>Version</th>
                        <th>Force Update</th>
                        <th>Last Updated</th>
                        {userPermissionsArray?.includes('update') && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {versionListData.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center">
                                No data found
                            </td>
                        </tr>
                    ) : (
                        versionListData.map((item: VersionList, index: number) => (
                            <tr key={item.app_version_id}>
                                <td>{index + 1}</td>
                                <td>{item.os}</td>
                                <td>{item.version}</td>
                                <td>
                                    <ToggleSwitch checked={item.is_force_update} />
                                </td>
                                <td>{new Date(item.updated_at).toLocaleString()}</td>
                                {userPermissionsArray?.includes('update') && (
                                    <td>
                                        <FaRegEdit
                                            size={20}
                                            style={{ cursor: 'pointer', marginRight: '10px' }}
                                            onClick={() => handleUpdateVersion(item)}
                                        />
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            {showVersionUpdateModal && selectedVerison && (
                <UpdateAppModal
                    show={showVersionUpdateModal}
                    onHide={() => setShowVersionUpdateModal(false)}
                    data={selectedVerison}
                    onSuccess={() => {
                        dispatch(versionList());
                        setShowVersionUpdateSuccessModal(true);
                    }}
                />
            )}
            <SuccessModal
                show={showVersionUpdateSuccessModal}
                onHide={() => setShowVersionUpdateSuccessModal(false)}
                message="Your Version has been Updated"
            />
        </div>
    ) : (
        <p style={{ color: 'red', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>
            You do not have permission to view this list.
        </p>
    );
};

export default AppUpdates;
