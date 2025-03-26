import React, { useEffect } from 'react';
import { useRedux } from '../../hooks';
import { userListFilter } from '../../redux/actions';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';

const UserManagement = () => {
    const { dispatch, appSelector } = useRedux();
    const { userLists = [], loading, error } = appSelector((state: RootState) => state.userManagement);
    const userListData = userLists?.data || [];

    useEffect(() => {
        const filterPayload = {
            min_age: null,
            max_age: null,
            education: null,
            country: null,
            city: null,
            birthdate: null,
            interested_in: null,
        };
        // dispatch(userListFilter(filterPayload));
    }, [dispatch]);

    return (
        <div>
            <h2>Twinner Users</h2>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {/* <BorderedTable data={userListData} /> */}
        </div>
    );
};

export default UserManagement;
