import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { Modal } from 'react-bootstrap';
import { RootState } from '../../redux/reducers';
import { blockRelationList } from '../../redux/actions';
import BorderedTable from '../tables/BasicTable/BorderedTable';
import { Table, Modal, Button, Pagination } from 'react-bootstrap';
import SoftButton from '../uikit/Buttons/SoftButton';

interface BlockRelationProps {
    show: boolean;
    onClose: () => void;
}

export interface BlockRelation {
    blocker_id: string;
    blocker_first_name: string;
    blocker_last_name: string;
    blocker_user_name: string;
    blocker_profile_image: string;
    blocked_id: string;
    blocked_first_name: string;
    blocked_last_name: string;
    blocked_user_name: string;
    blocked_profile_image: string;
    created_at: string;
}

export interface BlockRelationList {
    current_page: number;
    total_pages: number;
    total_block_relations: number;
    block_relations: BlockRelation[];
}

const BlockRelation: React.FC<BlockRelationProps> = ({ show, onClose }) => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const reportState = useSelector((state: RootState) => state.report);
    console.log('reportState>>>>>', reportState);
    const blockRelations: BlockRelation[] = reportState.block_relations || [];

    console.log('blockRelations from redux:', blockRelations);

    const blockRelationsTwo = useSelector((state: RootState) => state.report);

    console.log('blockRelations from redux TWO:', blockRelationsTwo);
    const pagination = useSelector((state: RootState) => state.report.pagination);
    useEffect(() => {
        console.log('Modal state:', show);
        if (show) {
            console.log('Dispatching blockRelationList action...');
            dispatch(blockRelationList(currentPage, itemsPerPage));
            console.log('Dispatched blockRelationList action...');
        }
    }, [show, dispatch, currentPage, itemsPerPage]);

    return (
        <Modal show={show} onHide={onClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Blocked Relations</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* {loading ? ( */}
                {/* <div className="text-center">Loading...</div>) : ( */}
                <BorderedTable title="Blocked Users">
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>Profile Image</th>
                                <th>Name</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blockRelations.length > 0 ? (
                                blockRelations.map((relation) => (
                                    <tr key={relation.blocked_id}>
                                        <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src={relation.blocked_profile_image || '/default-profile.jpg'}
                                                alt={`${relation.blocked_first_name} ${relation.blocked_last_name}`}
                                                width="40"
                                                height="40"
                                                style={{ borderRadius: '50%' }}
                                            />
                                        </td>
                                        <td>
                                            {relation.blocked_first_name} {relation.blocked_last_name}
                                        </td>
                                        <td>@{relation.blocked_user_name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">
                                        No Blocked Users Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </BorderedTable>

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
            </Modal.Body>
        </Modal>
    );
};

export default BlockRelation;
