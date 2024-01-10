import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function AppHeader() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">KhojEvent</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"> 
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link> 
            <Nav.Link href="/services">Create Events</Nav.Link> 
            <Nav.Link href="/works">Events</Nav.Link> 
            {/* <Nav.Link href="#teams">Teams</Nav.Link> */}
            <Nav.Link href="/testimonials">Testimonials</Nav.Link>
            {/* <Nav.Link href="#pricing">Pricing</Nav.Link> */}
            <Nav.Link href="/blog">Blog</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
            {/* <Nav.Link href="#signin">Sign In</Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

// export default AppHeader;

// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom

// function AppHeader() {
//   return (
//     <Navbar bg="light" expand="lg">
//       <Container>
//         {/* Use Link instead of href for internal navigation */}
//         <Link to="/" className="navbar-brand">
//           KhojEvent
//         </Link>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <Nav className="me-auto">
//             <Link to="/" className="nav-link">
//               Home
//             </Link>
//             <Link to="/about" className="nav-link">
//               About
//             </Link>
//             {/* Link "Create Events" to the /create-event route */}
//             <Link to="/CreateEvent" className="nav-link">
//               Create Events
//             </Link>
//             <Link to="/events" className="nav-link">
//               Events
//             </Link>
//             {/* Uncomment the following lines when you have corresponding routes */}
//             {/* <Link to="/teams" className="nav-link">
//               Teams
//             </Link>
//             <Link to="/testimonials" className="nav-link">
//               Testimonials
//             </Link>
//             <Link to="/pricing" className="nav-link">
//               Pricing
//             </Link>
//             <Link to="/blog" className="nav-link">
//               Blog
//             </Link> */}
//             <Link to="/contact" className="nav-link">
//               Contact
//             </Link>
//             <Link to="/signin" className="nav-link">
//               Sign In
//             </Link>
//           </Nav>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// }

export default AppHeader;
