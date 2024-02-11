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

  const handleDownloadReceipt = () => {
    // Logic to download receipt
    console.log("Receipt downloaded");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }


  
  return (
    <section className="min-vh-100 d-flex flex-column justify-content-center" style={{ backgroundColor: "#fcedf0" }}>
      <div className="container py-4" style={{ maxWidth: "700px" }}>
        <div className="row justify-content-center">
          <div className="col-md-12" >
          <h3>Order ID #{order.id} </h3>
            <div style={{ backgroundColor: '#f9f9f9', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', padding: '20px', marginBottom: '20px' }}>
              <div className="row justify-content-between align-items-start">
                <div className="col-md-12 text-end mb-4">
                  <button className="btn btn-sm btn-primary mb-0" onClick={handleDownloadReceipt}>Download Receipt</button>
                </div>
              </div>
              <table className="table table-borderless" style={{ backgroundColor: '#f8f7ff' }}>
  <tbody>
    {order.tickets.map(ticket => (
      <tr key={ticket.id} style={{ padding: '10px' }}>
        <td style={{ fontFamily: 'Montserrat, sans-serif', width: '150px', textAlign: 'center', padding: '10px' }}>
          <img src={ticket.event.image} alt={ticket.event.name} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
        </td>
        <td style={{ fontFamily: "Dancing Script",verticalAlign: 'middle', textAlign: 'center', padding: '10px' , fontSize: "20px" }}>{ticket.event.name}</td>
        <td style={{ fontFamily: 'Montserrat, sans-serif',verticalAlign: 'middle', textAlign: 'center', padding: '10px' }}>{ticket.ticket.ticket.name}</td>
        <td style={{ fontFamily: 'Montserrat, sans-serif',verticalAlign: 'middle', textAlign: 'center', padding: '10px' }}>{ticket.quantity} x </td>
        <td style={{ fontFamily: 'Montserrat, sans-serif',verticalAlign: 'middle', textAlign: 'center', padding: '10px' }}>{ticket.ticket.ticket.price}</td>
      </tr>
    ))}
  </tbody>
</table>
<div className="row">
<div className="col-md-8">
    <p style={{fontFamily: 'Montserrat, sans-serif', color: 'rgba(0, 0, 0, 0.6)',marginTop: '50px'}}><strong>Created Date:</strong> {order.created_at}</p>
  </div>
  <div className="col-md-4" >
    <p style={{fontFamily: 'Montserrat, sans-serif', color: 'rgba(0, 0, 0, 0.6)',marginTop: '50px'}}><strong>Total:</strong> {order.total_amount}</p>
  </div>

</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
                  }  


export default Order;
