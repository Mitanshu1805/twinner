// import React, { useState, useEffect } from 'react';
// import { Modal, Button, Form } from 'react-bootstrap';
// import { useDispatch } from 'react-redux';
// import { interestAdd } from '../../redux/actions';

// interface RegisterInterestModalProps {
//     show: boolean;
//     onClose: () => void;
// }

// const RegisterInterestModal: React.FC<RegisterInterestModalProps> = ({ show, onClose }) => {
//     const [interestName, setInterestName] = useState('');
//     const [interestImage, setInterestImage] = useState<File | null>(null); // File instead of string]
//     const [previewImage, setPreviewImage] = useState<string | null>(null);

//     const dispatch = useDispatch();

//     useEffect(() => {
//         if (!show) {
//             setInterestName('');
//             setInterestImage(null);
//             setPreviewImage(null);
//         }
//     }, [show]);

//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0] || null;
//         setInterestImage(file);

//         if (file) {
//             const imageUrl = URL.createObjectURL(file);
//             setPreviewImage(imageUrl);
//         } else {
//             setPreviewImage(null);
//         }
//     };

//     const handleSubmit = () => {
//         if (!interestName || !interestImage) {
//             alert('Please provide both an interest name and an image.');
//             return;
//         }

//         // Creating FormData
//         const formData = new FormData();
//         formData.append('interest_name', interestName);
//         formData.append('interest_image', interestImage);

//         dispatch(interestAdd(formData)); // Dispatch action with FormData
//         onClose(); // Close the modal
//     };

//     return (
//         <Modal show={show} onHide={onClose}>
//             <Modal.Header closeButton>
//                 <Modal.Title>Register Interest</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Form>
//                     <Form.Group className="mb-3">
//                         <Form.Label>Interest Name</Form.Label>
//                         <Form.Control
//                             type="text"
//                             value={interestName}
//                             onChange={(e) => setInterestName(e.target.value)}
//                             placeholder="Enter interest name"
//                         />
//                     </Form.Group>
//                     <Form.Group className="mb-3">
//                         <Form.Label>Interest Image</Form.Label>
//                         <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
//                     </Form.Group>
//                     {previewImage && (
//                         <div className="text-center">
//                             <img
//                                 src={previewImage}
//                                 alt="Preview"
//                                 style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
//                             />
//                         </div>
//                     )}
//                 </Form>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onClose}>
//                     Close
//                 </Button>
//                 <Button variant="primary" onClick={handleSubmit}>
//                     Submit
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default RegisterInterestModal;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { interestAdd, interestList, interestUpdate } from '../../redux/actions';

interface Interest {
    interest_id?: string;
    interest_name: string;
    interest_image: string;
}

interface RegisterInterestModalProps {
    show: boolean;
    onClose: () => void;
    interestToEdit?: Interest | null;
}

const RegisterInterestModal: React.FC<RegisterInterestModalProps> = ({ show, onClose, interestToEdit }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [interestName, setInterestName] = useState('');
    const [interestImage, setInterestImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (interestToEdit) {
            setInterestName(interestToEdit.interest_name);
            setPreviewImage(interestToEdit.interest_image);
        } else {
            setInterestName('');
            setInterestImage(null);
            setPreviewImage(null);
        }
    }, [show, interestToEdit]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setInterestImage(file);

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleSubmit = () => {
        if (!interestName || (!interestImage && !interestToEdit)) {
            alert('Please provide both an interest name and an image.');
            return;
        }

        const formData = new FormData();
        formData.append('interest_name', interestName);

        if (interestImage instanceof File) {
            // Append image if a new one is selected
            formData.append('interest_image', interestImage);
        } else if (interestToEdit?.interest_image && typeof interestToEdit.interest_image === 'string') {
            // Preserve existing image URL if no new image is uploaded
            formData.append('interest_image', interestToEdit.interest_image);
        }

        if (interestToEdit?.interest_id) {
            // If editing, send update API
            formData.append('interest_id', interestToEdit.interest_id);
            dispatch(interestUpdate(formData));
        } else {
            // If adding, send add API
            dispatch(interestAdd(formData));
        }

        setTimeout(() => {
            dispatch(interestList(currentPage, itemsPerPage));
            onClose();
        }, 500);
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{interestToEdit ? 'Edit Interest' : 'Register Interest'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Interest Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={interestName}
                            onChange={(e) => setInterestName(e.target.value)}
                            placeholder="Enter interest name"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Interest Image</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} accept="image/*" />
                    </Form.Group>
                    {previewImage && (
                        <div className="text-center">
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {interestToEdit ? 'Save Changes' : 'Submit'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegisterInterestModal;
