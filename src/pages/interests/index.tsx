import { Col, Row } from 'react-bootstrap';

// hooks
import { usePageTitle } from '../../hooks';

// dummy data

const Interests = () => {
    // set pagetitle
    usePageTitle({
        title: 'DashBoard',
        breadCrumbItems: [
            {
                path: '/dashboard',
                label: 'DashBoard',
                active: true,
            },
        ],
    });

    return <></>;
};

export default Interests;
