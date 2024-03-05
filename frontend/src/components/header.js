//header.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { Navbar, Container, Nav, Form, FormControl, Button, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// function Cart() {
//   const [remainingTime, setRemainingTime] = useState(null);

//   useEffect(() => {
//     const fetchCartData = async () => {
//       try {
//         const token = localStorage.getItem('Bearer');
//         const response = await axios.get(`http://127.0.0.1:8000/tickets/cart/${localStorage.getItem("id")}`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         const cartData = response.data;
//         const cartExpirationTime = new Date(cartData.expiration_time).getTime();
//         const remainingMilliseconds = cartExpirationTime - Date.now();
//         if (remainingMilliseconds <= 0) {
//           clearInterval(intervalId); // Stop fetching data once the timer has expired
//           intervalId=setInterval(fetchCartData,0);
//           console.log("hey")
//         }
//         setRemainingTime(remainingMilliseconds);
//       } catch (error) {
//         console.error('Error fetching cart data:', error);
//       }
//     };

//     const intervalId = setInterval(fetchCartData, 1000); // Refresh cart data every second
//     return () => clearInterval(intervalId); // Cleanup the interval
//   }, []);

//   const formatTime = (remainingMilliseconds) => {
//     if (remainingMilliseconds <= 0) return "00:00:00";
//     const hours = Math.floor((remainingMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//   };

//   return (
//     <>
//       {remainingTime !== null && remainingTime > 0 ? (
//         <Nav.Link href="/cart">
//           <FaShoppingCart size={20} />
//           {remainingTime !== null && remainingTime >= 0 && (
//             <span style={{ marginLeft: "5px", color: "gray" }}>
//               {formatTime(remainingTime)}
//             </span>
//           )}
//         </Nav.Link>
//       ) : (
//         <Nav.Link href="/cart">
//           <FaShoppingCart size={20} />
//         </Nav.Link>
//       )}
//     </>
//   );
// }

function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAttendee, setIsAttendee] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authtoken = localStorage.getItem("Bearer");
    if (authtoken) {
      setIsLoggedIn(true);
      axios.get('http://127.0.0.1:8000/users/me/', {
        headers: {
          Authorization: `Bearer ${authtoken}`
        }
      }).then(response => {
        localStorage.setItem("id", response.data.id);
        setIsAttendee(response.data.is_attendee);
      }).catch(error => {
        console.error("Error fetching user details:", error);
      });
    }
  }, []);

  // useEffect(() => {
  //   if (isAttendee && isLoggedIn) {
  //     const fetchCartData = async () => {
  //       try {
  //         const token = localStorage.getItem('Bearer');
  //         const response = await axios.get(`http://127.0.0.1:8000/tickets/cart/${localStorage.getItem("id")}`, {
  //           headers: {
  //             Authorization: `Bearer ${token}`
  //           }
  //         });
  //         const cartData = response.data;
  //         const cartExpirationTime = new Date(cartData.expiration_time).getTime();
  //         const remainingMilliseconds = cartExpirationTime - Date.now();
  //         if (remainingMilliseconds <= 0) {
  //           setShowTimer(false); // Stop displaying the timer
  //           clearInterval(intervalId);
  //           console.log("HEllo")
  //         }
  //       } catch (error) {
  //         console.error('Error fetching cart data:', error);
  //       }
  //     };

  //     const intervalId = setInterval(fetchCartData, 1000); // Refresh cart data every second
  //     return () => clearInterval(intervalId); // Cleanup the interval
  //   }
  // }, [isAttendee, isLoggedIn]);

  const logout = () => {
    localStorage.removeItem("Bearer");
    localStorage.removeItem("id");
    setIsLoggedIn(false);
    setIsAttendee(false);
    console.log("You are logged out");
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search/?query=${searchQuery}`);
  };

  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/home">KhojEvent</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form
            className="d-flex"
            onSubmit={handleSearch}
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
            <Nav.Link href="/create-event">Create Events</Nav.Link>
            <Nav.Link href="/events">Events</Nav.Link>
            <Nav.Link href="/testimonials">Testimonials</Nav.Link>

            {isLoggedIn ? (
              <>
              
                {/* {isAttendee && showTimer && <Cart />} */}
                {isAttendee && (
      <Nav.Link href="/cart">
        <FaShoppingCart size={20} />
      </Nav.Link>
    )}
                <NavDropdown title={<CgProfile size={20} />} id="basic-nav-dropdown">
                  <NavDropdown.Item href={`/profile/${localStorage.getItem("id")}`}>
                    View Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
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
