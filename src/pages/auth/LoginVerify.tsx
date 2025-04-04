import { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Alert, Button } from 'react-bootstrap';
import { useRedux } from '../../hooks';
import { verifyOTP } from '../../redux/actions';

const VerifyOTP = () => {
    const [otpInput, setOtpInput] = useState('');
    const { dispatch, appSelector } = useRedux();
    const { user, userLoggedIn, error, loading, otp } = appSelector((state) => state.Auth);

    const location = useLocation();
    const phone_number = location.state?.phone_number;

    if (!otp || !phone_number) return <Navigate to="/auth/login" />;

    const handleVerify = () => {
        dispatch(verifyOTP(phone_number, otpInput));
    };

    if (user && userLoggedIn) return <Navigate to="/" />;

    return (
        <div>
            <label>Enter OTP</label>
            <input type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} maxLength={6} />
            {error && <Alert variant="danger">{error}</Alert>}
            <Button onClick={handleVerify} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
        </div>
    );
};

export default VerifyOTP;
