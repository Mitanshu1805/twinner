import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { reportList } from '../../redux/actions';
import { RootState } from '../../redux/store';

const ReportAndBlock = () => {
    const { dispatch, appSelector } = useRedux();
    const { reports = [], loading, error } = appSelector((state: RootState) => state.report);
    const reportListData = reports?.data || [];

    useEffect(() => {
        dispatch(reportList());
    }, [dispatch]);
    return <div>Report & Block</div>;
};

export default ReportAndBlock;
