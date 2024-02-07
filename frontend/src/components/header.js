import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import { Navbar, Container, Nav, Form, FormControl, Button, NavDropdown } from 'react-bootstrap';

function AppHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Function to save the token to session storage
  const saveTokenToSessionStorage = (token) => {
    sessionStorage.setItem('authToken', token);
  };

  // Function to retrieve the token from session storage
  const getTokenFromSessionStorage = () => {
    return sessionStorage.getItem('authToken');
  };

  // Function to handle search
  const handleSearch = async () => {
    try {
      console.log('Before axios.get');

      // Always make an HTTP request to your Django backend endpoint with the search query
      const searchResponse = await axios.get(`http://127.0.0.1:8000/search/?query=${searchQuery}`);

      // Handle the search response as needed (e.g., update state with search results)
      console.log('Search Results:', searchResponse.data);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to handle user login
  const handleLogin = async () => {
    try {
      // Make an HTTP request for user login
      const loginResponse = await axios.post('http://127.0.0.1:8000/login', {
        username,
        password,
      });

      // Check the login response and update the isLoggedIn state accordingly
      if (loginResponse.data.success) {
        const authToken = loginResponse.data.token;

        // Save the token to session storage
        saveTokenToSessionStorage(authToken);

        setIsLoggedIn(true);
      } else {
        console.error('Login failed:', loginResponse.data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Check if the user is already logged in by retrieving the token from session storage
  useEffect(() => {
    const authToken = getTokenFromSessionStorage();
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/home">KhojEvent</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="d-flex" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
            <FormControl
              type="search"
              placeholder="Search"
              className="mr-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-transparent" type="submit">
              <FaSearch style={{ color: 'black' }} />
            </Button>
          </Form>
          <Nav className="me-auto">
          <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/services">Create Events</Nav.Link>
            <Nav.Link href="/events">Events</Nav.Link>
            <Nav.Link href="/testimonials">Testimonials</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>

            {isLoggedIn ? (
              <NavDropdown title="Profile" id="basic-nav-dropdown">
                <NavDropdown.Item href="/profile">View Profile</NavDropdown.Item>
                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppHeader;
