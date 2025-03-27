import React, { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { supportHelpList } from '../../redux/actions';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';

interface Help {
    help_center_id: string;
    name: string;
    email: string;
    description: string;
    user: User | null;
    created_at: string;
}

interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    phone_number: string;
    country: string;
    city: string;
    profile_image: string;
}

const HelpAndSupport = () => {
    const { dispatch, appSelector } = useRedux();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { helpAndSupports = [], loading, error } = appSelector((state: RootState) => state.report);

    useEffect(() => {
        dispatch(supportHelpList());
    }, [dispatch]);

    useEffect(() => {
        console.log('Selected User Changed:', selectedUser);
    }, [selectedUser]);

    const handleUserSelection = (user: User | null) => {
        if (user) {
            console.log('Clicked User:', user);
            setSelectedUser(user);
        }
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            {!loading && (
                <BorderedTable title="Help & Support">
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>Profile Image</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Email</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {helpAndSupports.length > 0 ? (
                                helpAndSupports.map((help: Help) => (
                                    <tr key={help.help_center_id}>
                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                onClick={() => {
                                                    console.log('Clicked user:', help.user); // 🔥 Debugging Log
                                                    if (help.user) {
                                                        setSelectedUser(help.user);
                                                    }
                                                }}
                                                src={help.user?.profile_image ?? '/default-profile.jpg'}
                                                alt={help.name}
                                                width="40"
                                                height="40"
                                                style={{ borderRadius: '50%', cursor: 'pointer' }}
                                            />
                                        </td>

                                        <td
                                        // onClick={() => {
                                        //     console.log('Clicked user:', help.user); // 🔥 Debugging Log
                                        //     if (help.user) {
                                        //         setSelectedUser(help.user);
                                        //     }
                                        // }}
                                        // style={{ cursor: 'pointer' }} // 🔥 Makes it clear that it's clickable
                                        >
                                            {help.name}
                                        </td>

                                        <td>{help.description}</td>
                                        <td>{help.email}</td>
                                        <td>{help.created_at}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center">
                                        No Help Requests Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </BorderedTable>
            )}

            {/* User Details Modal */}
            <Modal show={selectedUser !== null} onHide={() => setSelectedUser(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            {/* <img
                                src={selectedUser.profile_image ?? '/default-profile.jpg'}
                                alt={selectedUser.first_name}
                                width="80"
                                height="80"
                                style={{ borderRadius: '50%', marginBottom: '10px' }}
                            /> */}
                            <p>
                                <strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}
                            </p>
                            <p>
                                <strong>Username:</strong> {selectedUser.user_name}
                            </p>
                            <p>
                                <strong>Phone:</strong> {selectedUser.phone_number}
                            </p>
                            <p>
                                <strong>Country:</strong> {selectedUser.country}
                            </p>
                            <p>
                                <strong>City:</strong> {selectedUser.city}
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default HelpAndSupport;
