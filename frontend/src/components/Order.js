import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Order = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch specific event data from Django backend API
    axios.get(`http://127.0.0.1:8000/tickets/orders/${orderId}/`)
      .then(response => {
        console.log(response)  // Wrap the data in an array
        setOrder(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [orderId]);



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Order Details</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#f9f9f9' }}>
        <p style={{ margin: '0' }}><strong>Order ID:</strong> {order.id}</p>
        <p style={{ margin: '0' }}><strong>Total Amount:</strong> {order.total_amount}</p>
        {/* Additional order details */}
        <p style={{ margin: '0' }}><strong>Customer Name:</strong> {order.tickets[0].ticket.issued_to.first_name} {order.tickets[0].ticket.issued_to.last_name}</p>
        <p style={{ margin: '0' }}><strong>Customer Email:</strong> {/* You need to provide the email field in your payload or the associated model */}</p>
        {/* Tickets details */}
        <h2>Tickets</h2>
        {order.tickets.map(ticket => (
          <div key={ticket.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '5px 0', borderRadius: '5px' }}>
            <p><strong>Ticket ID:</strong> {ticket.id}</p>
            <p><strong>Quantity:</strong> {ticket.quantity}</p>
            <p><strong>Ticket Name:</strong> {ticket.ticket.ticket.name}</p>
            <p><strong>Price:</strong> {ticket.ticket.ticket.price}</p>
            {/* Add more ticket details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};


export default Order;
