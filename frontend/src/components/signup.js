import React from 'react';

const AppSignup = () => {
  return (
    <div className='container pt-5'>
      <div className='row justify-content-center'>
        <div className='col-sm-8 col-md-6'>
          <div className='card p-4 shadow rounded'>
            <h3 className='mb-4 text-center'>Sign Up</h3>
            <form>
              <div className='form-group'>
                <label htmlFor='email' className='form-label'>
                  Email
                </label>
                <input
                  type='email'
                  className='form-control'
                  id='email'
                  placeholder='name@example.com'
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
                />
              </div>
              <div className='form-group'>
                <label htmlFor='phone' className='form-label'>
                  Phone No.
                </label>
                <input type='phone' className='form-control' id='phone' />
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
          <p>&copy; 2022 Your Company. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AppSignup;
