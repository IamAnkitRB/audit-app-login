/* eslint-disable no-console */
import React, { useState } from 'react';
import './Login.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpEnabled, setOtpEnabled] = useState(false);

  // Mock API for generating or resending OTP
  const handleGenerateOtp = async (isResend = false) => {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    try {
      const data = {
        success: true,
        message: isResend
          ? 'OTP (1234) resent successfully.'
          : 'OTP (1234) sent successfully.',
      };

      if (data.success) {
        setOtpEnabled(true);
        alert(data.message);
      } else {
        alert(data.message || 'Failed to generate OTP.');
      }
    } catch (error) {
      console.error(
        isResend ? 'Error resending OTP:' : 'Error generating OTP:',
        error,
      );
      alert('An error occurred. Please try again.');
    }
  };

  // Mock API for validating OTP
  const handleValidateOtp = async (event) => {
    event.preventDefault();

    if (!otp) {
      alert('Please enter your OTP.');
      return;
    }

    try {
      const data =
        otp === '1234'
          ? { success: true, message: 'OTP validated successfully.' }
          : { success: false, message: 'Invalid OTP.' };

      if (data.success) {
        alert(data.message);
        window.location.href =
          'https://test-portal-contentninja-6343592.hs-sites.com/audit-app-dashboard';
      } else {
        alert(data.message || 'Invalid OTP.');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!otpEnabled) {
      handleGenerateOtp();
    } else {
      handleValidateOtp(event);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Sign In</h1>
        <form onSubmit={handleSubmit}>
          <div className="email-container">
            <input
              type="email"
              id="email"
              className="email-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              id="otp"
              className="otp-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={!otpEnabled}
              required
            />
          </div>

          <div className="button-container">
            <button type="submit" className="action-button">
              {otpEnabled ? 'Submit' : 'Generate OTP'}
            </button>
            {otpEnabled && (
              <button
                type="button"
                className="resend-otp-button"
                onClick={() => handleGenerateOtp(true)}
              >
                Resend OTP
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
