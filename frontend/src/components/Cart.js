import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import { Link,useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [timer,setTimer]=useState();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [remainingTime, setRemainingTime] = useState(null); // State to hold remaining time
  
  useEffect(() => {
    fetchAttendeeId();
  }, []);



  const fetchAttendeeId = async () => {
    try {
      const token = localStorage.getItem('Bearer');
      const response = await axios.get('http://127.0.0.1:8000/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const fetchedUserData = response.data;

      if (fetchedUserData.is_organiser) {
        setErrorMessage('Login with an attendee account to view cart.');
      } else {
        const fetchedAttendeeId = fetchedUserData.id;
        fetchCartItems(fetchedAttendeeId);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchCartItems = async (attendeeId) => {
    try {
      const token = localStorage.getItem('Bearer');
      const response = await axios.get(`http://127.0.0.1:8000/tickets/cart/${attendeeId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const fetchedCartData = response.data;
      const fetchedCartItems = fetchedCartData.tickets;
      setTimer(response.data.expiration_time);
      // Update the local state with the fetched cart items
      setCartItems(fetchedCartItems);
  
      const totalPrice = parseFloat(fetchedCartData.total_amount);
      setTotal(totalPrice);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  useEffect(() => {
    // Start the timer when cart is loaded
    if (cartItems.length > 0) {
      console.log(timer)
      const expirationTime = Date.parse(timer);
      console.log(expirationTime); 
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = expirationTime - now;
        setRemainingTime(distance);
        if (distance <= 0) {
          clearInterval(interval);
          handleCartExpiration();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [cartItems]);
  
  const handleCartExpiration = async () => {
    try {
      const token = localStorage.getItem('Bearer');
      const cartItems = []; // Array to store IDs of cart items
      
      // Retrieve cart items from backend
      const response = await axios.get(`http://127.0.0.1:8000/tickets/cart/${localStorage.getItem("id")}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const items = response.data.tickets;
      
      // Extract IDs of cart items
      items.forEach(item => {
        cartItems.push(item.id);
      });
  
      // Delete each cart item
      await Promise.all(cartItems.map(async itemId => {
        await axios.delete(`http://127.0.0.1:8000/tickets/cart/${itemId}/update/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }));
      
      // Reload the page and redirect to events page
      window.location.reload();
      navigate('/events');
      
    } catch (error) {
      console.error('Error deleting cart items:', error);
    }
  };
  

  const removeItemFromCart = async (itemId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tickets/cart/${itemId}/update/`);
      window.location.reload()
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const updatedCartItems = cartItems.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedCartItems);
      // Update the total amount based on the updated quantities
      const updatedTotal = updatedCartItems.reduce((acc, item) => acc + (item.ticket.price * item.quantity), 0);
      setTotal(updatedTotal);

      // Make the API call to update the quantity on the server
      await axios.patch(`http://127.0.0.1:8000/tickets/cart/${itemId}/update/`, { quantity: newQuantity });
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };
  const redirectToEventsPage = () => {
    navigate('/events');
  };
  const handleCheckout = () => {
    // Redirect to the checkout page
    navigate('/checkout');
  };
 
   return (
    <section className="min-vh-100 d-flex flex-column justify-content-center" style={{ backgroundColor: "#fcedf0" }}>
      {/* Timer display */}
      {remainingTime !== null && (
        <div className="text-center mb-4">
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', color: '#6c757d' }}>
            Cart Expiration: {formatTime(remainingTime)}
          </p>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '14px', color: '#6c757d' }}>
          -checkout now to secure your tickets-</p>
        </div>
      )}


      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10 text-center">
            {cartItems.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-normal mb-0 text-dark" style={{ fontFamily: "", color: "#fcedf0" }}>Shopping Cart:</h3>
              </div>
            )}

          {cartItems.length === 0 && (
            <div className="text-center mb-4">
              <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '18px', color: '#6c757d' }}>No items in the cart</p>
              <button className="btn btn-primary" onClick={redirectToEventsPage}>Explore Events</button>
            </div>
          )}


            {cartItems.map((item, index) => (
              <div className="card rounded-3 mb-4" key={index}>
                <div className="card-body p-4">
                  <div className="row justify-content-between align-items-center">
                    <div className="col-md-2 col-lg-2 col-xl-2 text-center">
                      <img src={item.event.image} className="rounded-3" alt={item.event.image} />
                    </div>
                    <div className="col-md-3 col-lg-3 col-xl-3">
                      <p className="lead fw-normal mb-1 text-dark" style={{ fontFamily:  "Comfortaa, cursive", color: "#f0a5b5 ", margin: "0.2", lineHeight: "2", fontSize: "26px" }}>{item.event.name}</p>
                      <p className="lead fw-normal mb-1 text-dark" style={{ fontFamily: "Comfortaa, cursive", color: "#6c757d", margin: "0.2", lineHeight: "1.5", fontSize: "14px" }}>Type: {item.ticket.name}</p>
                      <p className="text-muted mb-0" style={{ fontFamily: "Comfortaa, cursive", color: "#6c757d ", margin: "0", lineHeight: "1.2", fontSize: "14px" }}>Price: Rs.{item.ticket.price}</p>
                    </div>

                    <div className="col-md-3 col-lg-3 col-xl-2 d-flex align-items-center justify-content-around">
                      <button className="btn btn-link px-2" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.ticket.quantity <= 1}>
                        <i className="fas fa-minus" style={{ color: "#f64b4b" }}></i>
                      </button>
                      <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                      <button className="btn btn-link px-2" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                        <i className="fas fa-plus" style={{ color: "#f64b4b" }}></i>
                      </button>
                    </div>
                    <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                      <h5 className="mb-0 text-muted" style={{ fontFamily: "Comfortaa, cursive",  color: "#fcedf0" }}>Rs.{(item.ticket.price * item.quantity).toFixed(2)}</h5>
                    </div>
                    <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                      <button className="btn btn-link text-danger" onClick={() => removeItemFromCart(item.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

{cartItems.length > 0 && (
  <div className="d-flex flex-column align-items-end">
    <div style={{ background: "#ffffff", padding: "20px", borderRadius: "15px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", marginRight: "20px", textAlign: "center", marginBottom: "20px" }}>
      <p className="lead fw-normal mb-1 text-dark" style={{ fontFamily: "Comfortaa, cursive", color: "#fcedf0", fontSize: "16px" }}>
        Total: Rs. {total}
      </p>
      <div className="mt-3 mb-3">
        <p className="text-center mb-0">
          <Link to="/events">Continue browsing for tickets</Link>
        </p>
      </div>
      <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </section>
  );
};

// Function to format remaining time as HH:MM:SS
const formatTime = (remainingTime) => {
  const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


export default Cart;