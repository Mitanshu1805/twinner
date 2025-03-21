import { Card, Dropdown, Table } from 'react-bootstrap';

// data
import { records } from './data';

// interface Interest {
//     interest_id: string;
//     interest_name: string;
//     interest_image: string;
// }

// interface TableProps {
//     interests: Interest[];
// }

interface TableWrapperProps {
    title: string;
    children: React.ReactNode;
    actionButton?: React.ReactNode;
}

const BorderedTable: React.FC<TableWrapperProps> = ({ title, children, actionButton }) => {
    return (
        <Card>
            <Card.Body>
                <Dropdown className="float-end" align="end">
                    <Dropdown.Toggle as="a" className="cursor-pointer card-drop">
                        <i className="mdi mdi-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>Action</Dropdown.Item>
                        <Dropdown.Item>Anothther Action</Dropdown.Item>
                        <Dropdown.Item>Something Else</Dropdown.Item>
                        <Dropdown.Item>Separated link</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="header-title">{title}</h4>
                    {actionButton && <div>{actionButton}</div>}
                </div>

                <div className="table-responsive">{children}</div>

                {/* <h4 className="header-title">Interests & Hobbies</h4> */}
                {/* <p className="text-muted font-14 mb-4">
                    Add <code>bordered</code> attribute for borders on all sides of the table and cells.
                </p> */}

                {/* <div className="table-responsive">
                    <Table className="mb-0" bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Interest Name</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {interests.length > 0 ? (
                                interests.map((interest, index) => (
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
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center">
                                        No Interests Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div> */}

                {/* <h4 className="header-title">Bordered table</h4>
                <p className="text-muted font-14 mb-4">
                    Add <code>bordered</code> attribute for borders on all sides of the table and cells.
                </p> */}

                {/* <div className="table-responsive">
                    <Table className="mb-0" bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(records || []).map((record, index) => {
                                return (
                                    <tr key={index.toString()}>
                                        <th scope="row">{record.id}</th>
                                        <td>{record.firstName}</td>
                                        <td>{record.lastName}</td>
                                        <td>{record.userName}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div> */}
            </Card.Body>
        </Card>
    );
};

export default BorderedTable;
