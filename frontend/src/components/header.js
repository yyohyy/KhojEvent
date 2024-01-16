import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function AppHeader() {
  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/home">KhojEvent</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
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
