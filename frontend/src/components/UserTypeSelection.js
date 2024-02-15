import React from 'react';
import { Link } from 'react-router-dom';

const UserTypeSelection = () => {
    return (
      <div className='auth-form-container d-flex justify-content-center align-items-center vh-100'>
        <div className='auth-form-box p-4 rounded shadow ' style={{ width: '400px' }}>
          <h3 className='mb-4 text-center'>Choose Your Role</h3>
          <div className='d-grid gap-2'>
            <Link to='/attendee-signup' className='btn btn-primary'>
              Attendee
            </Link>
            <Link to='/organizer-signup' className='btn btn-primary'>
              Organizer
            </Link>
          </div>
        </div>
      </div>
    );
  };
export default UserTypeSelection;
