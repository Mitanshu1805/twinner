import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';

// hooks
import { useRedux } from '../../hooks/';

// actions
import { resetAuth, sendOTP, verifyOTP } from '../../redux/actions';

// components
import Loader from '../../components/Loader';
import AuthLayout from './AuthLayout';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css'; // import the style

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

    // const schemaResolver = yupResolver(
    //     yup.object().shape({
    //         phone_number: yup
    //             .string()
    //             .required(t('Please enter Phone Number'))
    //             .test('is-valid-phone', t('Invalid phone number format'), (value) => {
    //                 if (!value) return false;
    //                 const cleaned = value.replace(/[^\d]/g, ''); // remove spaces, dashes, etc.
    //                 return /^\d{10,15}$/.test(cleaned); // must be 10-15 digits
    //             }),
    //     })
    // );

    const schemaResolver = yupResolver(
        yup.object().shape({
            phone_number: yup
                .string()
                .required(t('Please enter Phone Number'))
                .matches(/^\+\d{10,15}$/, t('Invalid phone number format')), // includes +
        })
    );

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<UserData>({
        resolver: schemaResolver,
    });

    const onSubmit = (formData: UserData) => {
        console.log('otp>>>>>', otp);
        if (otp) {
            dispatch(verifyOTP(formData.phone_number, local_otp));
        } else {
            dispatch(sendOTP(formData.phone_number));
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

                <form onSubmit={handleSubmit(onSubmit)}>
                    {!otp ? (
                        <div className="mb-3">
                            <label className="form-label">{t('Phone Number')}</label>
                            <Controller
                                name="phone_number"
                                control={control}
                                render={({ field }) => (
                                    <PhoneInput
                                        country={'in'}
                                        {...field}
                                        value={field.value}
                                        onChange={(value) => field.onChange('+' + value.replace(/\D/g, ''))}
                                        onKeyDown={(e) => {
                                            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
                                            if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                                e.preventDefault();
                                            }
                                        }}
                                        inputStyle={{ width: '100%' }}
                                        inputProps={{
                                            name: 'phone_number',
                                            required: true,
                                            autoComplete: 'tel',
                                        }}
                                    />
                                )}
                            />

                            {errors.phone_number && (
                                <small className="text-danger">{errors.phone_number.message}</small>
                            )}
                        </div>
                    ) : (
                        <div className="mb-3">
                            <label className="form-label">{t('Enter OTP')}</label>
                            <input
                                type="number"
                                name="otp"
                                value={local_otp}
                                maxLength={6}
                                onChange={(e) => setOtp(e.target.value)}
                                className="form-control"
                                placeholder="Enter OTP"
                                required
                            />
                        </div>
                    )}

                    <div className="text-center d-grid mb-3">
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <div className="spinner spinner-small" /> : t(otp ? 'Login' : 'Send OTP')}
                        </Button>
                    </div>
                </form>
                {otp && (
                    <div className="text-center mt-3">
                        <span className="fw-bold fs-5 text-primary">OTP eceived : {otp}</span>
                    </div>
                )}
            </AuthLayout>
        </>
    );
};

export default Login;
