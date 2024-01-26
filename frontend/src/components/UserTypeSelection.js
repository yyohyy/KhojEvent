import React from 'react';
import { Link } from 'react-router-dom';

const UserTypeSelection = () => {
  return (
    <div className='container pt-5'>
      <div className='row justify-content-center'>
        <div className='col-sm-8 col-md-6'>
          <div className='card p-4 shadow rounded'>
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
      </div>
    </div>
  );
};

export default UserTypeSelection;
