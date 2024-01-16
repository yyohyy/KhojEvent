import { useState } from "react"
import React from 'react'
import AuthUser from "./AuthUser";
 const Applogin = () => {
  const {http} = AuthUser();
  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const submitForm= ()=>{
    //api call
    // http.post('/login',{email:email,password:password}).then((res)=>{console.log(res.data);})
    console.log(email + ''+ password)
  }

  return (
    
  <div className='row justify-content-center pt-5'>
  <div class='col-sm-6'>
    <div className='card p-4'>
    <div class="form-group">
  <label for="email" class="col-sm-2 col-form-label">Email </label>
  <input type="email" class="form-control" id="email" placeholder="name@example.com"
  onChange={e=>setEmail(e.target.value)}/>
</div>
  <div class="form-group">
    <label for="password" class="col-sm-2 col-form-label">Password</label>
    <input type="password" class="form-control" id="password"
    onChange={e=>setPassword(e.target.value)}/>
  </div>
  {/* <div class="col-12">
    <div class="form-check">
      <input class="form-check-input" type="checkbox" id="gridCheck"/>
      <label class="form-check-label" for="gridCheck">
         Already have an account?
      </label>
    </div>
  </div> */}
  <div class="col-auto">
    <button type="submit" onClick={submitForm} class="btn btn-primary mb-4">Login</button>
  </div>
    </div>
  </div>
  </div>
  )
}
export default Applogin
