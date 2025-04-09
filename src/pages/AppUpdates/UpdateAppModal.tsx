import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { versionUpdate, versionList } from '../../redux/actions';
import ToggleSwitch from '../../components/ToggleSwitch';

interface Props {
    show: boolean;
    onHide: () => void;
    data: {
        app_version_id: string;
        version: string;
        is_force_update: boolean;
    };
    onSuccess: () => void;
}

const UpdateAppModal: React.FC<Props> = ({ show, onHide, data, onSuccess }) => {
    const [version, setVersion] = useState(data.version);
    const [forceUpdate, setForceUpdate] = useState(data.is_force_update);
    const { dispatch } = useRedux();

    const handleSubmit = () => {
        dispatch(
            versionUpdate({
                app_version_id: data.app_version_id,
                version,
                is_force_update: forceUpdate,
            })
        );

        setTimeout(() => {
            dispatch(versionList());
            onSuccess();
            onHide();
        }, 500);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update App Version</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="version">
                        <Form.Label>Version</Form.Label>
                        <Form.Control type="text" value={version} onChange={(e) => setVersion(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="forceUpdate" className="mt-4">
                        <Form.Label>Force Update</Form.Label>
                        <div>
                            <ToggleSwitch checked={forceUpdate} onChange={(val) => setForceUpdate(val)} />
                        </div>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UpdateAppModal;
