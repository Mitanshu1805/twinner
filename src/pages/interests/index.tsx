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
import RegisterInterestModal from './RegisterInterestModal';

interface Interest {
    interest_id: string;
    interest_name: string;
    interest_image: string;
}

const InterestHobbies = () => {
    const { dispatch, appSelector } = useRedux();
    const { interests = [], loading, error } = appSelector((state: RootState) => state.interest);
    const interestListData = interests?.data || [];
    const buttonVariant: Variant[] = ['primary'];
    const [message, setMessage] = useState<string>('');
    const [showInterestRegModal, setShowInterestRegModal] = useState(false);
    const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(interestList(currentPage, itemsPerPage));
    }, [dispatch, currentPage]);

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
        dispatch(interestList(currentPage, itemsPerPage)); // Refresh list after adding/editing
    };

    const handleDeleteInterest = (interest_id: string) => {
        if (window.confirm('Are you sure you want to delete this interest?')) {
            dispatch(interestDelete(interest_id));
        }
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && (
                <BorderedTable
                    title="Interests & Hobbies"
                    actionButton={
                        <SoftButton variant="primary" onClick={handleAddInterest}>
                            Add Interest
                        </SoftButton>
                    }>
                    <RegisterInterestModal
                        show={showInterestRegModal}
                        onClose={handleCloseRegModal}
                        interestToEdit={selectedInterest}
                    />
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Interest Name</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interestListData.length > 0 ? (
                                interestListData.map((interest: Interest, index: number) => (
                                    <tr key={interest.interest_id}>
                                        <td>{index + 1}</td>
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
                                            <FaRegEdit
                                                size={20}
                                                style={{ cursor: 'pointer', marginRight: '10px' }}
                                                onClick={() => handleEditInterest(interest)}
                                            />
                                            <FaTrash
                                                size={20}
                                                style={{ cursor: 'pointer', color: 'red' }}
                                                onClick={() => handleDeleteInterest(interest.interest_id)}
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
                        className="pagination-controls"
                        style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <SoftButton
                            variant="secondary"
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className={currentPage === 1 ? 'disabled-button' : ''}>
                            Previous
                        </SoftButton>

                        <SoftButton
                            variant="secondary"
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className={interestListData.length < itemsPerPage ? 'disabled-button' : ''}>
                            Next
                        </SoftButton>
                    </div>
                </BorderedTable>
            )}
        </div>
    );
};

export default InterestHobbies;
