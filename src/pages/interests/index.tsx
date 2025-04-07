// import React, { useEffect, useState } from 'react';
// import { Card, Table } from 'react-bootstrap';
// import { useRedux } from '../../hooks';
// import { interestList, interestDelete, interestAdd } from '../../redux/interestAndHobbies/actions';
// import { RootState } from '../../redux/store';
// import BorderedTable from '../tables/BasicTable/BorderedTable';
// import SoftButton from '../uikit/Buttons/SoftButton';
// import { Variant } from '../uikit/Buttons/types';
// import './interestFile.css';
// import { FaRegEdit, FaTrash } from 'react-icons/fa';
// import RegisterInterestModal from './RegisterInterestModal';

// interface Interest {
//     interest_id: string;
//     interest_name: string;
//     interest_image: string;
// }

// const InterestHobbies = () => {
//     const { dispatch, appSelector } = useRedux();
//     const { interests = [], loading, error } = appSelector((state: RootState) => state.interest);
//     const interestListData = interests?.data || [];
//     const buttonVariant: Variant[] = ['primary'];
//     const [message, setMessage] = useState<string>('');
//     const [showInterestRegModal, setShowInterestRegModal] = useState(false);
//     const [isInterestEditing, setIsInterestEditing] = useState<boolean>(false);
//     const [editedInterest, setEditedInterest] = useState<Interest | null>(null);
//     const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     useEffect(() => {
//         dispatch(interestList(currentPage, itemsPerPage)); // Dispatch action to fetch interests
//     }, [dispatch, currentPage]);

//     const handleInterestRegistration = () => {
//         if (!showInterestRegModal) {
//             setShowInterestRegModal(true);
//         }
//     };

//     const handleCloseRegModal = () => {
//         setShowInterestRegModal(false);
//     };

//     const handleDeleteInterest = (interest_id: string) => {
//         const confirmDelete = window.confirm('Are you sure you want to delete this interest');

//         if (confirmDelete) {
//             console.log('Deleting interest with id', interest_id);
//             dispatch(interestDelete(interest_id));
//         }
//     };

//     const handleEditInterest = (interest_id: string, interest_name: string, interest_image: string) => {
//         const interestToUpdate = interestListData.find((interest: Interest) => interest.interest_id === interest_id);

//         if (!interestToUpdate) {
//             setMessage('Interest not found');
//             return;
//         }

//         console.log('Editing Interest with id:', interest_id);
//         setIsInterestEditing(true);
//         setEditedInterest(interestToUpdate);
//         setSelectedInterest(interestToUpdate);
//     };

//     const handleSaveInterestChanges = () => {
//         if (editedInterest) {
//             const formData = new FormData();
//             formData.append('interest_id', editedInterest.interest_id);
//             formData.append('interest_name', editedInterest.interest_name);

//             // Check if the image is a file or a URL
//             // if (editedInterest.interest_image instanceof File) {
//             formData.append('interest_image', editedInterest.interest_image);
//             // }

//             console.log('FormData ready for submission:', Object.fromEntries(formData.entries())); // Debugging

//             dispatch(interestAdd(formData)); // ✅ Pass correct type (FormData)

//             setIsInterestEditing(false);
//             setMessage('Interest edited successfully');
//             setTimeout(() => {
//                 setMessage('');
//                 dispatch(interestList());
//             }, 500);
//             setSelectedInterest(editedInterest);
//         }
//     };

//     return (
//         <div>
//             {loading && <p>Loading...</p>}
//             {error && <p style={{ color: 'red' }}>{error}</p>}

//             {!loading && (
//                 <BorderedTable
//                     title="Interests & Hobbies"
//                     actionButton={
//                         <SoftButton variant="primary" className="soft-button" onClick={handleInterestRegistration}>
//                             Add Interest
//                         </SoftButton>
//                     }>
//                     <RegisterInterestModal show={showInterestRegModal} onClose={handleCloseRegModal} />
//                     <Table className="mb-0" bordered>
//                         <thead>
//                             <tr>
//                                 <th>#</th>
//                                 <th>Interest Name</th>
//                                 <th>Image</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {interestListData.length > 0 ? (
//                                 interestListData.map((interest: Interest, index: number) => (
//                                     <tr key={interest.interest_id}>
//                                         <td>{index + 1}</td>
//                                         <td>
//                                             {isInterestEditing &&
//                                             selectedInterest?.interest_id === interest.interest_id ? (
//                                                 <input
//                                                     type="text"
//                                                     value={editedInterest?.interest_name || ''}
//                                                     onChange={(e) =>
//                                                         setEditedInterest((prev) =>
//                                                             prev ? { ...prev, interest_name: e.target.value } : null
//                                                         )
//                                                     }
//                                                 />
//                                             ) : (
//                                                 interest.interest_name
//                                             )}
//                                         </td>
//                                         <td>
//                                             <img
//                                                 src={interest.interest_image}
//                                                 alt={interest.interest_name}
//                                                 width="50"
//                                                 height="50"
//                                                 style={{ borderRadius: '8px' }}
//                                             />
//                                         </td>
//                                         <td>
//                                             <FaRegEdit
//                                                 size={20}
//                                                 style={{ cursor: 'pointer', marginRight: '10px' }}
//                                                 onClick={() =>
//                                                     handleEditInterest(
//                                                         interest.interest_id,
//                                                         interest.interest_name,
//                                                         interest.interest_image
//                                                     )
//                                                 }
//                                             />
//                                             <FaTrash
//                                                 size={20}
//                                                 style={{ cursor: 'pointer', color: 'red' }}
//                                                 onClick={() => handleDeleteInterest(interest.interest_id)}
//                                             />
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={4} className="text-center">
//                                         No Interests Found
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </Table>

//                     {/* Pagination Controls */}
//                     <div
//                         className="pagination-controls"
//                         style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
//                         <SoftButton
//                             variant="secondary"
//                             onClick={() => setCurrentPage((prev) => prev - 1)}
//                             className={currentPage === 1 ? 'disabled-button' : ''}>
//                             Previous
//                         </SoftButton>

//                         <SoftButton
//                             variant="secondary"
//                             onClick={() => setCurrentPage((prev) => prev + 1)}
//                             className={interestListData.length < itemsPerPage ? 'disabled-button' : ''}>
//                             Next
//                         </SoftButton>
//                     </div>
//                 </BorderedTable>
//             )}
//         </div>
//     );
// };

// export default InterestHobbies;

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

interface Interest {
    interest_id: string;
    interest_name: string;
    interest_image: string;
}

type Permission = {
    module_name: string;
    permissions: string; // Stored as a string (e.g., '{read}')
};

const columns = [
    {
        Header: '#',
        accessor: 'id',
        sort: true,
    },
    {
        Header: 'Interest Name',
        accessor: 'interestName',
        sort: true,
    },
    {
        Header: 'Image',
        accessor: 'image',
        sort: false,
    },
    {
        Header: 'Actions',
        accessor: 'actions',
        sort: true,
    },
];
const sizePerPageList = [
    {
        text: '5',
        value: 5,
    },
    {
        text: '10',
        value: 10,
    },
    {
        text: '25',
        value: 25,
    },
    {
        text: 'All',
        // value: data.length,
    },
];

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
    // const itemsPerPage = 10;
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // const permissions: Permission[] = useSelector((state: RootState) => state.Auth.user.permissions);

    // const userPermission = permissions.find((perm) => perm.module_name === 'Interest');

    // const userPermissionsArray: string[] = userPermission
    //     ? userPermission.permissions.replace(/[{}]/g, '').split(/\s*,\s*/)
    //     : [];

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
                        interestToEdit={selectedInterest}
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

                    {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
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
                                disabled={currentPage >= (pagination?.totalPages ?? 1)}
                                className="px-4 py-2">
                                Next
                            </SoftButton>
                        </div>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setItemsPerPage(Number(e.target.value));
                            }}>
                            {[5, 10, 25, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size} per page
                                </option>
                            ))}
                        </select>
                    </div> */}
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
