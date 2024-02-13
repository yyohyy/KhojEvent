import React, { useState, useEffect } from "react";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";

// import {useNavigate } from 'react-router-dom';
import {
  Navbar,
  Container,
  Nav,
  Form,
  FormControl,
  Button,
  NavDropdown,
} from "react-bootstrap";

function AppHeader() {
  // const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchResults, setSearchResults] = useState({
    event_results: [],
  });

  // Function to handle search
  const handleSearch = async () => {
    try {
      console.log("Before axios.get");

      // Always make an HTTP request to your Django backend endpoint with the search query
      const searchResponse = await axios.get(
        `http://127.0.0.1:8000/search/?query=${searchQuery}`
      );

      // Handle the search response as needed (e.g., update state with search results)
      console.log("Search Results:", searchResponse.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Check if the user is already logged in by retrieving the token from session storage
  useEffect(() => {
    const authtoken = localStorage.getItem("Bearer");
    if (authtoken) {
      setIsLoggedIn(true);
          // Fetch the user details including user_id from the backend
    axios.get('http://127.0.0.1:8000/users/me/', {
      headers: {
        Authorization: `Bearer ${authtoken}`
      }
    }).then(response => {
      // Store the user_id in local storage
      localStorage.setItem("id", response.data.id);
    }).catch(error => {
      console.error("Error fetching user details:", error);
    });
          }
  }, []);
  
  const logout = () => {
    // Perform logout functionality
    localStorage.removeItem("Bearer");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
    console.log("You are logged out");
    // navigate('/'); // Redirect to login page after logout
  };
  

  // Function to perform the search
  const performSearch = async () => {
    try {
      // Make an HTTP request to your Django backend endpoint with the search query
      const response = await axios.get(
        `http://127.0.0.1:8000/events/search?query=${searchQuery}`
      );
      // Handle the response as needed (e.g., update state with search results)
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/home">KhojEvent</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <FormControl
              type="search"
              placeholder="Search"
              className="mr-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-transparent" type="submit">
              <FaSearch style={{ color: "black" }} />
            </Button>
          </Form>
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/services">Create Events</Nav.Link>
            <Nav.Link href="/events">Events</Nav.Link>
            <Nav.Link href="/testimonials">Testimonials</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>

            {isLoggedIn ? (
              <NavDropdown title={<CgProfile size={20} />} id="basic-nav-dropdown">
                <NavDropdown.Item href={`/profile/${localStorage.getItem("id")}`}>
                  View Profile
                </NavDropdown.Item>
                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
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