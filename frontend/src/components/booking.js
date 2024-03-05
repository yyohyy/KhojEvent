import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from './axios';
import { FaTimes } from 'react-icons/fa';

function BookingPage() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [quantity, setQuantity] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTicketTypesForBooking = async () => {
      try {
        const response = await AxiosInstance.get(`http://127.0.0.1:8000/tickets/${event_id}/`);
        setTicketTypes(response.data.ticket_types);
        // Initialize quantity state for each ticket type
        const initialQuantity = {};
        response.data.ticket_types.forEach(ticket => {
          initialQuantity[ticket.id] = 0; // Start quantity from 0
        });
        setQuantity(initialQuantity);
      } catch (error) {
        console.error('Error fetching ticket types for booking:', error);
      }
    };
    fetchTicketTypesForBooking();
  }, [event_id]);

  const handleSelectTicket = (ticket) => {
    setSelectedTickets({
      ...selectedTickets,
      [ticket.id]: ticket,
    });
  };

  const handleQuantityChange = (ticketId, e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity({
      ...quantity,
      [ticketId]: newQuantity,
    });
  };

  const handleAddToCart = async () => {
    try {
      // Initialize an array to store the selected tickets with quantities
      const selectedTicketsWithQuantity = [];
  
      // Iterate over each selected ticket
      Object.entries(selectedTickets).forEach(([ticketId, ticket]) => {
        const qty = quantity[ticketId];

        if (qty > 0) {
          selectedTicketsWithQuantity.push({ ticketId: parseInt(ticketId), quantity: qty });
        }
      });
      if (selectedTicketsWithQuantity.length === 0) {
        alert('Please select a quantity greater than 0 for at least one ticket type.');
        return;
      }
  
      const authToken = localStorage.getItem('Bearer');
      await Promise.all(selectedTicketsWithQuantity.map(async (ticket) => {
        const payload = {
          ticket: ticket.ticketId,
          quantity: ticket.quantity,
        };
        await AxiosInstance.post(`http://127.0.0.1:8000/tickets/select/${event_id}/`, payload, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
      }));
      navigate('/cart');
    }  catch (error) {
      if (error.response && error.response.status === 400) {
        // Handle 400 Bad Request error
        setErrorMessage("Max ticket limit for the event exceeded.");
        console.log("Max limit exceeded")
      } else {
        // Handle other errors
        console.error('Error selecting tickets:', error);
      }
    }
  };
   
    
  return (
    <div className="container booking-container mt-5 mb-5 p-4 shadow " style={{ minHeight: "700px" }}>
      <div className="row justify-content-end">
        <div className="col-auto">
          <FaTimes className="close-icon" onClick={() => navigate(`/events/${event_id}`)} />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4">
            <h1 className="text-center mb-4">Booking Page</h1>
            {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
            <div className="row">
              {ticketTypes.map((ticket) => (
                <div key={ticket.id} className="col-md-4 mb-4">
                  <div
                    className={`card h-100 ${selectedTickets[ticket.id] ? 'border-primary' : ''}`}
                    onClick={() => handleSelectTicket(ticket)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{ticket.name}</h5>
                      <p className="card-text">{ticket.description}</p>
                      <label>
                        Quantity:
                        <input
                          type="number"
                          value={quantity[ticket.id] || 0}
                          onChange={(e) => handleQuantityChange(ticket.id, e)}
                          min="0" // Start quantity from 0
                          className="form-control"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <button onClick={handleAddToCart} className="btn btn-primary">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;