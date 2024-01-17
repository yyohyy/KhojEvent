import React from 'react'

 const AppSignup = () => {
  return (
    <div className='row justify-content-center pt-5'>
      
    <div class='col-sm-6'>
      <div className='card p-4'>
      <div class="form-group">
    <label for="email" class="col-sm-2 col-form-label">Email </label>
    <input type="email" class="form-control" id="email" placeholder="name@example.com"/>
  </div>
    <div class="form-group">
      <label for="password" class="col-sm-2 col-form-label">Password</label>
      <input type="password" class="form-control" id="password"/>
    </div>
    <div class="form-group">
      <label for="phone" class="col-sm-2 col-form-label">Phone No.</label> 
      <input type="phone" class="form-control" id="phone"/>
    </div>
    <div class="col-12">
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="gridCheck"/>
        <label class="form-check-label" for="gridCheck">
           Already have an account?
        </label>
      </div>
    </div>
    <div class="col-auto">
      <button type="submit"  class="btn btn-primary mb-4">Sign Up</button>
    </div>
      </div>
    </div>
    </div>
  
  )
}
export default AppSignup;
