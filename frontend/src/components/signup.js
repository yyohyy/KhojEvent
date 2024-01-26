import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    re_password: '',
  });

  const [passwordStrengthMessage, setPasswordStrengthMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Check password strength and update the message
    checkPasswordStrength(value);
  };

  const checkPasswordStrength = (password) => {
    const minLength = 8;
    const minUppercase = 1;
    const minLowercase = 1;
    const minNumbers = 1;
    const minSpecialChars = 1;

    const uppercaseRegex = /[A-Z]/g;
    const lowercaseRegex = /[a-z]/g;
    const numbersRegex = /[0-9]/g;
    const specialCharsRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/g;

    const isLengthSufficient = password.length >= minLength;
    const hasUppercase = (password.match(uppercaseRegex) || []).length >= minUppercase;
    const hasLowercase = (password.match(lowercaseRegex) || []).length >= minLowercase;
    const hasNumbers = (password.match(numbersRegex) || []).length >= minNumbers;
    const hasSpecialChars = (password.match(specialCharsRegex) || []).length >= minSpecialChars;

    // Check if the password meets all criteria
    const isStrong =
      isLengthSufficient && hasUppercase && hasLowercase && hasNumbers && hasSpecialChars;

    // Update the passwordStrengthMessage based on the criteria
    setPasswordStrengthMessage(
      isStrong
        ? ''
        : 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
    );

    // Return a boolean indicating whether the password is strong
    return isStrong;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.password !== formData.re_password) {
        console.error('Passwords do not match');
        return;
      }

      // Check password strength before making the API call
      const isStrongPassword = checkPasswordStrength(formData.password);

      if (!isStrongPassword) {
        // Display a pop-up message indicating a weak password
        alert('Create a strong password');
        return;
      }

      // Make an API call to register the user
      const response = await axios.post('http://127.0.0.1:8000/auth/users/', formData);

      // Handle the response, you might want to show a success message or navigate to the login page
      console.log('Registration successful:', response.data);

      // Navigate to the user type selection page
      navigate('/user-type-selection');
    } catch (error) {
      // Handle registration failure
      console.error('Registration error:', error.response.data);
    }
  };

  return (
    <div className='container pt-5'>
      <div className='row justify-content-center'>
        <div className='col-sm-8 col-md-6'>
          <div className='card p-4 shadow rounded'>
            <h3 className='mb-4 text-center'>Sign Up</h3>
            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='email' className='form-label'>
                  Email
                </label>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  placeholder='name@example.com'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='password' className='form-label'>
                  Password
                </label>
                <input
                  type='password'
                  className='form-control'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                {passwordStrengthMessage && (
                  <p className='text-danger'>{passwordStrengthMessage}</p>
                )}
              </div>

              <div className='form-group'>
                <label htmlFor='re_password' className='form-label'>
                  Re-enter Password
                </label>
                <input
                  type='password'
                  className='form-control'
                  id='re_password'
                  name='re_password'
                  value={formData.re_password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='form-check mb-3'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='gridCheck'
                />
                <label className='form-check-label' htmlFor='gridCheck'>
                  Already have an account?
                </label>
              </div>
              <div className='d-grid'>
                <button type='submit' className='btn btn-primary'>
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Consideration for the Footer */}
      <div className='row mt-5'>
        <div className='col text-center'>
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AppSignup;
