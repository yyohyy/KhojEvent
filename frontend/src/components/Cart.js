import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

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

      setCartItems(fetchedCartItems);

      const totalPrice = parseFloat(fetchedCartData.total_amount);
      setTotal(totalPrice);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const removeItemFromCart = async (itemId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/tickets/selected/${itemId}/delete`);
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/tickets/selected/${itemId}/update`, { quantity: newQuantity });
      fetchCartItems();
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = async () => {
    try {
      // Make a POST request to the checkout endpoint
      // Handle checkout logic
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };
   return (
    <section className="h-100" style={{ backgroundColor: "#fcedf0" }}>
      <div className="container py-5 h-100">
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-normal mb-0 text-dark" style={{ fontFamily: "", color: "#fcedf0" }}>Shopping Cart:</h3>
            </div>

            {cartItems.map((item, index) => (
              <div className="card rounded-3 mb-4" key={index}>
                <div className="card-body p-4">
                  <div className="row justify-content-between align-items-center">
                    <div className="col-md-2 col-lg-2 col-xl-2 text-center">
                      
                      <img src={item.event.image} className="rounded-3" alt={item.event.image} />
                    </div>
                    <div className="col-md-3 col-lg-3 col-xl-3">
                    <p className="lead fw-normal mb-2 text-dark" style={{ fontFamily: "Arial", color: "#fcedf0" }}>{item.event.name}</p>
                      <p className="lead fw-normal mb-2 text-dark" style={{ fontFamily: "Arial", color: "#fcedf0" }}>{item.ticket.name}</p>
                      <p className="text-muted" style={{ fontFamily: "Arial", color: "#fcedf0" }}>Price: ${item.ticket.price}</p>
                    </div>
                    <div className="col-md-3 col-lg-3 col-xl-2 d-flex align-items-center justify-content-around">
                      <button className="btn btn-link px-2" onClick={() => handleQuantityChange(item.ticket.id, item.ticket.quantity - 1)} disabled={item.ticket.quantity <= 1}>
                        <i className="fas fa-minus" style={{ color: "#f64b4b" }}></i>
                      </button>
                      <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                      <button className="btn btn-link px-2" onClick={() => handleQuantityChange(item.ticket.id, item.ticket.quantity + 1)}>
                        <i className="fas fa-plus" style={{ color: "#f64b4b" }}></i>
                      </button>
                    </div>
                    <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                      <h5 className="mb-0 text-dark" style={{ fontFamily: "Arial", color: "#fcedf0" }}>${(item.ticket.price * item.quantity).toFixed(2)}</h5>
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

            <div className="text-end">
              <p className="text-dark" style={{ fontFamily: "Arial", color: "#fcedf0" }}>Total: ${total}</p>
              <button className="btn btn-primary" onClick={handleCheckout}>Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;