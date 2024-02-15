import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AttendeeSignup = () => {
  const navigate = useNavigate();
  const [attendeeData, setAttendeeData] = useState({
    // Include any additional fields specific to attendee signup
    first_name: '',
    last_name:'',
    birth_date:'',

    // Add more fields as needed
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAttendeeData({ ...attendeeData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve the authentication token from local storage
      const authToken = localStorage.getItem('Bearer'); // Replace with the actual key you used for storing the token

      if (!authToken) {
        // Handle the case when the token is not available
        console.error('Authentication token not found in local storage');
        return;
      }
      console.log(authToken);
      // Make another API call with the obtained token
      const response = await axios.post('http://127.0.0.1:8000/users/attendee/', attendeeData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Handle the response, show a success message or navigate to another page if needed
      console.log('Attendee signup successful:', response.data);

      // Navigate to the home page
      navigate('/');
    } catch (error) {
      // Handle attendee signup failure
      console.error('Attendee signup error:', error.response?.data || error.message);
    }
  };

    return (
      <div className='auth-form-container d-flex flex-column justify-content-between align-items-center vh-100' style={{ paddingTop: '50px' }}>
        <div className='card p-4 shadow rounded' style={{ width: '400px' }}>
          <h3 className='mb-4 text-center'>Attendee Sign Up</h3>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='first_name' className='form-label'>
                First Name
              </label>
              <input
                type='text'
                className='form-control'
                id='first_name'
                placeholder='Your First Name'
                name='first_name'
                value={attendeeData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='last_name' className='form-label'>
                Last Name
              </label>
              <input
                type='text'
                className='form-control'
                id='last_name'
                placeholder='Your Last Name'
                name='last_name'
                value={attendeeData.last_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='birth_date' className='form-label'>
                Date of Birth
              </label>
              <input
                type='date'
                className='form-control'
                id='birth_date'
                name='birth_date'
                value={attendeeData.birth_date}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Add more fields as needed for attendee signup */}
            <div className='d-grid'>
              <button type='submit' className='btn btn-primary'>
                Sign Up as Attendee
              </button>
            </div>
          </form>
        </div>
        <footer className="container mt-auto">
          <div className="row">
            <div className="col text-center">
              <p>Footer Content Here</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

export default AttendeeSignup;
