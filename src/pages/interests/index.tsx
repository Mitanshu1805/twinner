import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { interestList, interestDelete, interestAdd } from '../../redux/interestAndHobbies/actions';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';
import SoftButton from '../uikit/Buttons/SoftButton';
import { Variant } from '../uikit/Buttons/types';
import './interestFile.css';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import RegisterInterestModal from './RegisterInterestModal';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import SuccessModal from '../../components/SuccessModal';

interface Interest {
    interest_id: string;
    interest_name: string;
    interest_image: string;
}

const InterestHobbies = () => {
    const { dispatch, appSelector } = useRedux();
    const { interests = [], loading, error } = appSelector((state: RootState) => state.interest);
    const interestListData = interests?.data?.interests || [];
    console.log('interestListData>>>>>>>>>', interestListData);
    const buttonVariant: Variant[] = ['primary'];
    const [message, setMessage] = useState<string>('');
    const [showInterestRegModal, setShowInterestRegModal] = useState(false);
    const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
    const pagination = useSelector((state: RootState) => state.interest?.interests?.data?.pagination);
    console.log('Pagination>>>>>>>>>', pagination);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showAddSuccessModal, setShowAddSuccessModal] = useState(false);
    const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false);

    const permissionsObj = useSelector((state: RootState) => state.Auth.user.data.permissions);
    const userPermissionsArray: string[] = permissionsObj?.Interest || [];
    const [interestToDelete, setInterestToDelete] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        dispatch(interestList(currentPage, itemsPerPage));
    }, [dispatch, currentPage, itemsPerPage]);

    const handleAddInterest = () => {
        setSelectedInterest(null);
        setShowInterestRegModal(true);
    };

    const handleEditInterest = (interest: Interest) => {
        setSelectedInterest(interest);
        setShowInterestRegModal(true);
    };

    const handleCloseRegModal = () => {
        setShowInterestRegModal(false);
        // dispatch(interestList(currentPage, itemsPerPage)); // Refresh list after adding/editing
        dispatch(interestList(currentPage, itemsPerPage));
    };

    const handleDeleteInterest = (interest_id: string) => {
        if (window.confirm('Are you sure you want to delete this interest?')) {
            dispatch(interestDelete(interest_id));
        }

        setTimeout(() => {
            dispatch(interestList(currentPage, itemsPerPage));
        }, 500);
    };
    const handleDeleteClick = (interest_id: string) => {
        setInterestToDelete(interest_id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (interestToDelete) {
            dispatch(interestDelete(interestToDelete));
            setTimeout(() => {
                dispatch(interestList(currentPage, itemsPerPage));
            }, 500);
        }
        setShowDeleteModal(false);
    };

    return userPermissionsArray.includes('read') ? (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && (
                <BorderedTable
                    title="Interests & Hobbies"
                    actionButton={
                        userPermissionsArray.includes('write') && (
                            <SoftButton variant="primary" onClick={handleAddInterest}>
                                Add Interest
                            </SoftButton>
                        )
                    }>
                    <RegisterInterestModal
                        show={showInterestRegModal}
                        onClose={handleCloseRegModal}
                        // interestToEdit={selectedInterest}
                        onSuccess={(isUpdate: boolean) => {
                            dispatch(interestList(currentPage, itemsPerPage));
                            setShowInterestRegModal(false);

                            if (isUpdate) {
                                setShowUpdateSuccessModal(true);
                            } else {
                                setShowAddSuccessModal(true);
                            }
                        }}
                        interestToEdit={selectedInterest}
                    />
                    <SuccessModal
                        show={showAddSuccessModal}
                        onClose={() => setShowAddSuccessModal(false)}
                        message="Interest has been added successfully"
                    />

                    <Table bordered>
                        <thead>
                            <tr>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>#</th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Interest Name
                                </th>
                                <th style={{ verticalAlign: 'middle', paddingTop: '0px', paddingBottom: '22px' }}>
                                    Image
                                </th>
                                {(userPermissionsArray?.includes('update') ||
                                    userPermissionsArray?.includes('delete')) && <th>Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {interestListData.length > 0 ? (
                                interestListData.map((interest: Interest, index: number) => (
                                    <tr key={interest.interest_id}>
                                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                        <td>{interest.interest_name}</td>
                                        <td>
                                            <img
                                                src={interest.interest_image}
                                                alt={interest.interest_name}
                                                width="50"
                                                height="50"
                                                style={{ borderRadius: '8px' }}
                                            />
                                        </td>
                                        <td>
                                            {userPermissionsArray?.includes('update') && (
                                                <FaRegEdit
                                                    size={20}
                                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                                    onClick={() => handleEditInterest(interest)}
                                                />
                                            )}
                                            <SuccessModal
                                                show={showUpdateSuccessModal}
                                                onClose={() => setShowUpdateSuccessModal(false)}
                                                message="Interest has been updated successfully"
                                            />
                                            {userPermissionsArray?.includes('delete') && (
                                                <FaTrash
                                                    size={20}
                                                    style={{ cursor: 'pointer', color: 'red' }}
                                                    onClick={() => handleDeleteClick(interest.interest_id)}
                                                />
                                            )}
                                            <ConfirmDeleteModal
                                                show={showDeleteModal}
                                                onClose={() => setShowDeleteModal(false)}
                                                onConfirm={confirmDelete}
                                                title="Delete this Interest"
                                                message="Are you sure you want to delete this interest? This action cannot be undone."
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center">
                                        No Interests Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    {/* Pagination Controls */}
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '24px',
                            flexWrap: 'wrap',
                            gap: '24px',
                        }}>
                        {/* Pagination Controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <SoftButton
                                variant="secondary"
                                onClick={() => currentPage > 1 && setCurrentPage((prev) => prev - 1)}
                                disabled={currentPage <= 1}
                                className="px-4 py-2">
                                Previous
                            </SoftButton>

                            <span style={{ fontWeight: '600', fontSize: '14px', color: '#4B5563' }}>
                                Page {currentPage} of {pagination?.total_pages ?? 1}
                            </span>

                            <SoftButton
                                variant="secondary"
                                onClick={() =>
                                    currentPage < (pagination?.total_pages ?? 1) && setCurrentPage((prev) => prev + 1)
                                }
                                disabled={currentPage >= (pagination?.total_pages ?? 1)}
                                className="px-4 py-2">
                                Next
                            </SoftButton>
                        </div>

                        {/* Items Per Page */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label
                                style={{
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    color: '#374151',
                                }}>
                                Items per page:
                            </label>
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setCurrentPage(1);
                                    setItemsPerPage(Number(e.target.value));
                                }}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #D1D5DB',
                                    fontSize: '14px',
                                    color: '#374151',
                                    backgroundColor: '#FFFFFF',
                                    cursor: 'pointer',
                                    minWidth: '100px',
                                }}>
                                {[5, 10, 25, 50].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </BorderedTable>
            )}
        </div>
    ) : (
        <p style={{ color: 'red', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', marginTop: '20px' }}>
            You do not have permission to view this list.
        </p>
    );
};

export default InterestHobbies;
