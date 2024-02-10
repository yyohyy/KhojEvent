import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import { Link,useNavigate, useParams } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const token = localStorage.getItem('Bearer');
        const response = await axios.get(`http://127.0.0.1:8000/tickets/cart/${localStorage.getItem("id")}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCartDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching cart details');
        setLoading(false);
      }
    };

    fetchCartDetails();
  }, []);

  const handleConfirmCheckout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('Bearer');
      const response = await axios.post('http://127.0.0.1:8000/tickets/checkout/', cartDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Assuming the response contains the order ID
      const orderId = response.data.id; // Replace 'orderId' with the actual key name
      // Fetch the order ID and redirect to the payment page
      navigate(`/payment/${orderId}`);
      console.log('Checkout successful');
    } catch (error) {
      setError('Error during checkout');
      console.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: "#fcedf0" }}>
      <div className="container py-4" style={{ maxWidth: "600px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0" style={{ fontFamily: "Comfortaa, cursive", fontSize: '20px' }}>ORDER DETAILS:</h2>
          <Link to="/cart">
            <FaTimes size={24} />
          </Link>
        </div>
        <div className="table-container" style={{ fontFamily: "Comfortaa, cursive", backgroundColor: "#ffffff", borderRadius: "15px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", padding: "20px" }}>
          <table className='table'>
            <thead>
              <tr>
                <th scope='col' className="text-center">Event</th>
                <th scope='col' className="text-center">Ticket Type</th>
                <th scope='col' className="text-center">Price</th>
                <th scope='col' className="text-center">Quantity</th>
                <th scope='col' className="text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {cartDetails.tickets.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{item.event.name}</td>
                  <td className="text-center">{item.ticket.name}</td>
                  <td className="text-center">Rs. {item.ticket.price}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">Rs. {(item.ticket.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan='4' className='text-end fw-bold'>Total:</td>
                <td>Rs. {cartDetails.total_amount}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-primary" onClick={handleConfirmCheckout} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Checkout'}
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
              };  
export default Checkout;