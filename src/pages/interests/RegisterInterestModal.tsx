import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
// import { useDispatch } from 'react-redux';
import { interestAdd, interestList, interestUpdate } from '../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { IntAndHobActionTypes } from '../../redux/interestAndHobbies/constants';

interface Interest {
    interest_id?: string;
    interest_name: string;
    interest_image: string;
}

interface RegisterInterestModalProps {
    show: boolean;
    onClose: () => void;
    interestToEdit?: Interest | null;
    onSuccess: (isUpdate: boolean) => void;
}

const urlToFile = async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
};

const RegisterInterestModal: React.FC<RegisterInterestModalProps> = ({ show, onClose, interestToEdit, onSuccess }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [interestName, setInterestName] = useState('');
    const [interestImage, setInterestImage] = useState<string | File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const interestError = useSelector((state: RootState) => state.interest?.error);
    console.log('interestError>>>>>>>', interestError);

    const [nameError, setNameError] = useState('');
    const [imageError, setImageError] = useState('');
    const [apiError, setApiError] = useState('');

    const dispatch = useDispatch();

    useEffect(() => {
        if (interestToEdit) {
            setInterestName(interestToEdit.interest_name);
            setPreviewImage(interestToEdit.interest_image);
            setInterestImage(interestToEdit.interest_image);
        } else {
            setInterestName('');
            setInterestImage(null);
            setPreviewImage(null);
        }

        setNameError('');
        setImageError('');
    }, [show, interestToEdit, dispatch]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setInterestImage(file);
        setImageError('');

        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
        }
    };

    const handleSubmit = async () => {
        let valid = true;

        if (!interestName.trim()) {
            setNameError('Interest name is required.');
            valid = false;
        } else {
            setNameError('');
        }

        if (!interestImage && !interestToEdit) {
            setImageError('Interest image is required.');
            valid = false;
        } else {
            setImageError('');
        }

        if (!valid) return;

        const formData = new FormData();
        formData.append('interest_name', interestName);

        if (interestImage instanceof File) {
            formData.append('interest_image', interestImage);
        } else if (typeof interestImage === 'string') {
            const filename = interestImage.split('/').pop() || 'existing-image.jpg';
            try {
                const fileFromUrl = await urlToFile(interestImage, filename);
                formData.append('interest_image', fileFromUrl);
            } catch (error) {
                setImageError('Failed to load image from URL. Please try uploading a new one.');
                return;
            }
        }

        if (interestToEdit?.interest_id) {
            formData.append('interest_id', interestToEdit.interest_id);
            dispatch(interestUpdate(formData));
        } else {
            dispatch(interestAdd(formData));
        }
    };

    useEffect(() => {
        if (interestError) {
            setApiError(interestError);
        } else if (interestError === null && show) {
            dispatch(interestList(currentPage, itemsPerPage));
            onSuccess(!!interestToEdit);
            onClose();
        }
    }, [interestError]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{interestToEdit ? 'Edit Interest' : 'Register Interest'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {interestError && (
                    <div className="alert alert-danger text-center" role="alert">
                        {apiError}
                    </div>
                )}

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Interest Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={interestName}
                            onChange={(e) => setInterestName(e.target.value)}
                            placeholder="Enter interest name"
                            isInvalid={!!nameError}
                        />
                        <Form.Control.Feedback type="invalid">{nameError}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Interest Image</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            isInvalid={!!imageError}
                        />
                        <Form.Control.Feedback type="invalid">{imageError}</Form.Control.Feedback>
                    </Form.Group>

                    {previewImage && (
                        <div className="text-center">
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                }}
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
