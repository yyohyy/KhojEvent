import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Activate = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams();
  const [activationStatus, setActivationStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleActivate = async () => {
    try {
      // Send a POST request to the Djoser activation endpoint
      await axios.post(`http://127.0.0.1:8000/auth/users/activation/`, { uid, token });
      // Set activation status to success
      setActivationStatus('success');
      // Redirect the user to the login page after successful activation
      navigate('/login');
    } catch (error) {
      // Set activation status to error
      setActivationStatus('error');
      // Set error message
      setErrorMessage('Error activating your account. Please try again later.');
      console.error('Activation error:', error.response.data);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        {activationStatus === 'success' && <p>Account activated successfully. You can now log in.</p>}
        {activationStatus === 'error' && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <div>
          <button onClick={handleActivate}>Activate Account</button>
        </div>
      </div>
    </div>
  );
};

export default Activate;
