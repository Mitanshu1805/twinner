import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';

// hooks
import { useRedux } from '../../hooks/';

// actions
import { resetAuth, sendOTP, verifyOTP } from '../../redux/actions';

// components
import { FormInput, VerticalForm } from '../../components/form/';
import Loader from '../../components/Loader';

import AuthLayout from './AuthLayout';

type LocationState = {
    from?: Location;
};

type UserData = {
    phone_number: string;
};

/* bottom links */
const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col xs={12} className="text-center">
                <p className="text-muted">
                    <Link to="/auth/forget-password" className="text-muted ms-1">
                        <i className="fa fa-lock me-1"></i>
                        {t('Forgot your password?')}
                    </Link>
                </p>
                <p className="text-muted">
                    {t("Don't have an account?")}{' '}
                    <Link to={'/auth/register'} className="text-dark ms-1">
                        <b>{t('Sign Up')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const Login = () => {
    const { t } = useTranslation();
    const { dispatch, appSelector } = useRedux();
    const [local_otp, setOtp] = useState('');
    const [phone_number, setPhoneNumber] = useState('');

    const { user, userLoggedIn, otp, loading, error } = appSelector((state) => ({
        otp: state.Auth.otp,
        loading: state.Auth.loading,
        error: state.Auth.error,
        user: state.Auth.user,
        userLoggedIn: state.Auth.userLoggedIn,
    }));

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            phone_number: yup.string().required(t('Please enter Phone Number')),
        })
    );

    /*
    handle form submission
    */
    const onSubmit = (formData: UserData) => {
        if (otp) {
            dispatch(verifyOTP(phone_number, otp));
        } else {
            dispatch(sendOTP(formData['phone_number']));
        }
    };

    const location = useLocation();
    let redirectUrl = '/';

    if (location.state) {
        const { from } = location.state as LocationState;
        redirectUrl = from ? from.pathname : '/';
    }

    return (
        <>
            {user && userLoggedIn && <Navigate to={redirectUrl} replace />}

            <AuthLayout bottomLinks={<BottomLink />}>
                <div className="text-center mb-4">
                    <h4 className="text-uppercase mt-0">{t(otp ? 'Verify OTP' : 'Send OTP')}</h4>
                </div>

                {error && (
                    <Alert variant="danger" className="my-2">
                        {error}
                    </Alert>
                )}

                <VerticalForm<UserData> onSubmit={onSubmit} resolver={schemaResolver}>
                    <FormInput
                        type={otp ? 'number' : 'phone'}
                        name="phone_number"
                        label={t(otp ? 'Enter OTP' : 'Phone Number')}
                        containerClass={'mb-3'}
                        value={otp ? local_otp : phone_number}
                        maxLength={otp ? 6 : 15}
                        onChange={(e) => {
                            otp ? setOtp(e.target.value) : setPhoneNumber(e.target.value);
                        }}
                    />

                    <div className="text-center d-grid mb-3">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <div className="spinner spinner-small" /> : t(otp ? 'Login' : 'Send OTP')}
                        </Button>
                    </div>
                </VerticalForm>
            </AuthLayout>
        </>
    );
};

export default Login;
