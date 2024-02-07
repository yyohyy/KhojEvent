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
      // Make an API call to handle attendee signup
      const response = await axios.post('http://127.0.0.1:8000/users/attendee/', attendeeData);

      // Handle the response, show a success message or navigate to another page if needed
      console.log('Attendee signup successful:', response.data);

        // Navigate to the home page
        navigate('/');
    } catch (error) {
      // Handle attendee signup failure
      console.error('Attendee signup error:', error.response.data);
    }
  };

  return (
    <div className='container pt-5'>
      <div className='row justify-content-center'>
      <div className='col-sm-8 col-md-6'>
  <div className='card p-4 shadow rounded'>
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
</div>

      </div>
    </div>
  );
};

export default AttendeeSignup;
