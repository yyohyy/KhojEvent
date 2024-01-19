// import React from 'react';
// import { View, Text, Button } from 'react-native';
// const Applogin = ({ navigation }) => {
//     return (
//         <View>
//             <Text>CreateAccountScreen</Text>
//             <Button title="Log in"
//                     onPress={() => navigation.navigate('Login')}
//             />
//         </View>
//     );
// }
// export default Applogin;

import axios from "axios";
import {useState} from "react";
// Define the Login function.
 const AppLogin = () => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     // Create the submit method.
     const submit = async e => {
          e.preventDefault();
          const user = {
                username: username,
                password: password
               };
    //       // Create the POST requuest
    //       const {data} = await                                                                            
    //                      axios.post('http://localhost:8000/token/',
    //                      user ,{headers: 
    //                     {'Content-Type': 'application/json'}},
    //                      withCredentials=true});

    //      // Initialize the access & refresh token in localstorage.      
    //      localStorage.clear();
    //      localStorage.setItem('access_token', data.access);
    //      localStorage.setItem('refresh_token', data.refresh);
    //      axios.defaults.headers.common['Authorization'] = 
    //                                      `Bearer ${data['access']}`;
    //      window.location.href = '/'
            }
         
            return (
                <div className="auth-form-container d-flex justify-content-center align-items-center vh-100">
                  <div className="auth-form-box p-4 rounded shadow">
                    <form className="auth-form" onSubmit={submit}>
                      <h3 className="auth-form-title mb-4 text-center">Sign In</h3>
                      <div className="form-group mb-3">
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                        <input
                          id="username"
                          className="form-control"
                          placeholder="Enter Username"
                          name="username"
                          type="text"
                          value={username}
                          required
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          className="form-control"
                          placeholder="Enter password"
                          value={password}
                          required
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                      <div className="text-center mt-3">
                        <small>
                          Don't have an account? <a href="/signup">Sign Up</a>
                        </small>
                      </div>
                    </form>
                  </div>
                </div>
              );
            };
            
            export default AppLogin;

// import React from 'react';

// const AppLogin = () => {
//   return (
//     <div>Login</div>
//   )
// }

// export default AppLogin;

// import React, { useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import {Link} from 'react-router-dom';
// import { connect } from 'react-redux';
// import { login } from '../actions/auth';
// import axios from 'axios';

// const AppLogin = ({ login, isAuthenticated }) => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '' 
//     });

//     const { email, password } = formData;

//     const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const onSubmit = e => {
//         e.preventDefault();

//         login(email, password);
//     };

//     const continueWithGoogle = async () => {
//         try {
//             const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/google-oauth2/?redirect_uri=${process.env.REACT_APP_API_URL}/google`)

//             window.location.replace(res.data.authorization_url);
//         } catch (err) {

//         }
//     };

//     const continueWithFacebook = async () => {
//         try {
//             const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/o/facebook/?redirect_uri=${process.env.REACT_APP_API_URL}/facebook`)

//             window.location.replace(res.data.authorization_url);
//         } catch (err) {

//         }
//     };

//     if (isAuthenticated) {
//         return <Navigate replace to='/' />
//     }

//     return (
//         <div className='container mt-5'>
//             <h1>Log In</h1>
//             <p>Login into your Account</p>
//             <form onSubmit={e => onSubmit(e)}>
//                 <div className='form-group'>
//                     <input
//                         className='form-control'
//                         type='email'
//                         placeholder='Email'
//                         name='email'
//                         value={email}
//                         onChange={e => onChange(e)}
//                         required
//                     />
//                 </div>
//                 <div className='form-group'>
//                     <input
//                         className='form-control'
//                         type='password'
//                         placeholder='Password'
//                         name='password'
//                         value={password}
//                         onChange={e => onChange(e)}
//                         minLength='6'
//                         required
//                     />
//                 </div>
//                 <button className='btn btn-primary' type='submit'>Login</button>
//             </form>
//             <button className='btn btn-danger mt-3' onClick={continueWithGoogle}>
//                 Continue With Google
//             </button>
//             <br />
//             <button className='btn btn-primary mt-3' onClick={continueWithFacebook}>
//                 Continue With Facebook
//             </button>
//             <p className='mt-3'>
//                 Don't have an account? <Link to='/signup'>Sign Up</Link>
//             </p>
//             <p className='mt-3'>
//                 Forgot your Password? <Link to='/reset-password'>Reset Password</Link>
//             </p>
//         </div>
//     );
// };

// const mapStateToProps = state => ({
//     isAuthenticated: state.auth.isAuthenticated
// });

// export default connect(mapStateToProps, { login })(AppLogin);
