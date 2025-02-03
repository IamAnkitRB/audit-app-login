/* eslint-disable no-console */
import React, { useState } from 'react';
import './Login.scss';

function Login() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpEnabled, setOtpEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const API_BASE_URL = 'https://tapir-relaxing-partly.ngrok-free.app';
  const APP_BASE_URL = 'https://test-portal-contentninja-6343592.hs-sites.com';

  // Generate or resend OTP
  const handleGenerateOtp = async (isResend = false) => {
    if (!email) {
      setMessage('Please enter your email.');
      setMessageType('error');
      return;
    }

    const endpoint = isResend ? '/resend' : '/request';

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.toLocaleLowerCase() }),
      });

      const data = await response.json();

      if (data.success) {
        setOtpEnabled(true);
        setMessage(data.message || 'OTP sent successfully.');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Failed to generate OTP.');
        setMessageType('error');
      }
    } catch (error) {
      console.error(
        isResend ? 'Error resending OTP:' : 'Error generating OTP:',
        error,
      );
      setMessage('An error occurred. Please try again later.');
      setMessageType('error');
    }
  };

  // Validate OTP
  const handleValidateOtp = async (event) => {
    event.preventDefault();

    if (!otp) {
      setMessage('Please enter your OTP.');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLocaleLowerCase(), otp, page: 'signin' }),
      });

      const data = await response.json();

      if (data.success) {
        console.log(data)
        document.cookie = `state=${data.state}; path=/; max-age=86400`;
        window.location.href = `${APP_BASE_URL}/audit-app-dashboard`;
      } else {
        setMessage(data.message || 'Invalid OTP.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      setMessage('An error occurred. Please try again later.');
      setMessageType('error');
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!otpEnabled) {
      handleGenerateOtp();
    } else {
      handleValidateOtp(event);
    }
  };

  return (
    <>
      <div className="logo_container">
        <div className="header__logo">
          <img
            src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/A-fill-249x300.png"
            alt="Boundary"
            className="header__logo_img"
          />
          <img
            src="https://6343592.fs1.hubspotusercontent-na1.net/hubfs/6343592/boundary-2.svg"
            alt="Boundary"
            className="header__logo_img_2"
          />
        </div>
      </div>
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
                required={otpEnabled}
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
        <div className='footer'>
          <p>
            Don't have an account?<a href="https://boundary.agency/test-page-hubspot-audit/"> Sign Up</a>
          </p>
        </div>
      </div>
      <div className="alert-message">
        {message && <div className={`message ${messageType}`}>{message}</div>}
      </div>
    </>
  );
}

export default Login;
