import axios from "axios";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const AppLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const navigate = useNavigate();

  // Create the submit method.
  const submit = async e => {
    e.preventDefault();

    try {
      // Make an API call to authenticate the user
      const response = await axios.post('http://127.0.0.1:8000/auth/jwt/create', {
        email,
        password,
      });

      // Handle the response
      const { access } = response.data;
      
      // Store the token in localStorage (you might want to use more secure storage)
      localStorage.setItem('Bearer', access);
      // Clear any previous error message
      setErrorMessage('');
      setIsLoggedIn(true);
      // Check user type after successful login
      const token = `Bearer ${localStorage.getItem('Bearer')}`;
      const userResponse = await axios.get('http://127.0.0.1:8000/users/me/', {
        headers: {
          Authorization: token,
        },
      });
      const user = userResponse.data;
      console.log(userResponse)
      console.log(user.is_attendee)
      console.log(user.is_organiser)
      // Redirect based on user type
      if (user.is_organiser || user.is_attendee) {
                //etIsLoggedIn(true);
        navigate('/');
        window.location.reload()
      } else {
        navigate('/user-type-selection');
        window.location.reload();
      }

    } catch (error) {
      // Handle authentication failure
      console.error('Authentication error:', error.response.data);
      if (error.response.status === 401 && error.response.data.detail === "No active account found with the given credentials") {
        // If account is not activated, display a message for the user
        setErrorMessage("Your account is not activated. Please check your email to activate your account.");
      } else {
        // If authentication fails for another reason, display a general error message
        setErrorMessage("Authentication failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-form-container d-flex justify-content-center align-items-center vh-100">
      <div className="auth-form-box p-4 rounded shadow" style={{ width: "400px" }}>
        <form className="auth-form" onSubmit={submit}>
          <h3 className="auth-form-title mb-4 text-center">Log In</h3>
          {errorMessage && <div className="alert alert-danger" role="alert">{errorMessage}</div>}
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              className="form-control"
              placeholder="Enter email"
              name="email"
              type="text"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
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
