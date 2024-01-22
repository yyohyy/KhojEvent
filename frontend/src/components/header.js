import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
function AppHeader() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      // Make an HTTP request to your Django backend endpoint with the search query
      const response = await axios.get(`/api/search?query=${searchQuery}`);

      // Handle the response as needed (e.g., update state with search results)
      console.log(response.data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };
  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/home">KhojEvent</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="mr-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline-transparent" onClick={handleSearch}>
            <FaSearch style={{ color: 'black' }} />
            </Button>
          </Form>
          <Nav className="me-auto"> 
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/services">Create Events</Nav.Link> 
            <Nav.Link href="/works">Events</Nav.Link> 
            <Nav.Link href="/testimonials">Testimonials</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
            <Nav.Link href="/signup">SignUp</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
export default AppHeader;
