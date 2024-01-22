import axios from "axios";
import {useState} from "react";
import { useNavigate } from 'react-router-dom';
// Define the Login function.
 const AppLogin = () => {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const navigate = useNavigate();
     // Create the submit method.
     const submit = async e => {
          e.preventDefault();
          const user = {
                username: username,
                password: password
               };
             
               try {
                // Make an API call to authenticate the user
                const response = await axios.post('http://your-backend-url/api/token/', {
                  username,
                  password,
                });
          
                // Handle the response
                const { access } = response.data;
                   
                // Store the token in localStorage (you might want to use more secure storage)
                localStorage.setItem('token', access);
                //navigation
                navigate('/');
                } catch (error) {
                // Handle authentication failure
                console.error('Authentication error:', error.response.data);
              }
            };
                   
    
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

