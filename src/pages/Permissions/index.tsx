import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { RootState } from '../../redux/store';
import BorderedTable from '../tables/BasicTable/BorderedTable';
import SoftButton from '../uikit/Buttons/SoftButton';
import { FaRegEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { permissionList } from '../../redux/actions';

const Permissions = () => {
    const { dispatch, appSelector } = useRedux();
    const { permissions = [], loading, error } = appSelector((state: RootState) => state.roles);
    console.log('Permissions: ', permissions);

    useEffect(() => {
        dispatch(permissionList());
    }, [dispatch]);
    return <div> Permissions </div>;
};

export default Permissions;
