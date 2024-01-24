import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AppSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    re_password: '',
    //phone: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    try {
      if (formData.password !== formData.re_password) {
        console.error('Passwords do not match');
        return;
      }

      // Make an API call to register the user
      const response = await axios.post('http://127.0.0.1:8000/auth/users/', formData);

      // Handle the response, you might want to show a success message or navigate to the login page
      console.log('Registration successful:', response.data);

      // Navigate to the login page
      navigate('/');
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
              </div>
              {/* <div className='form-group'>
                <label htmlFor='phone' className='form-label'>
                  Phone No.
                </label>
                <input
                  type='phone'
                  className='form-control'
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div> */}
              <div className='form-group'>
                <label htmlFor='re_password' className='form-label'>
                  Re password
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