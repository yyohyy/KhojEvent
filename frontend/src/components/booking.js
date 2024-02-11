import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from './axios';

function BookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [ticketTypes, setTicketTypes] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchTicketTypesForBooking = async () => {
      try {
        const response = await AxiosInstance.get(`tickets/${eventId}/create/`);
        const ticketData = response.data[0];
        setTicketTypes(ticketData.ticket_types);
      } catch (error) {
        console.error('Error fetching ticket types for booking:', error);
      }
    };
    if (eventId) {
      fetchTicketTypesForBooking();
    }
  }, [eventId]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Add selected ticket to cart with quantity
    if (selectedTicket) {
      // Assuming you have a cart management system, you can add the selected ticket and quantity here.
      console.log('Added to cart:', { ticket: selectedTicket, quantity });
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h1 className="text-center mb-4">Booking Page</h1>
            <ul className="list-group">
              {ticketTypes.map((ticket) => (
                <li
                  key={ticket.id}
                  className={`list-group-item ${selectedTicket === ticket ? 'active' : ''}`}
                  onClick={() => handleSelectTicket(ticket)}
                  style={{ cursor: 'pointer' }}
                >
                  {ticket.name} - {ticket.price}
                </li>
              ))}
            </ul>
            {selectedTicket && (
              <div className="mt-4">
                <p className="fw-bold">Selected Ticket: {selectedTicket.name}</p>
                <label className="mb-2">
                  Quantity:
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    className="form-control"
                  />
                </label>
                <button onClick={handleAddToCart} className="btn btn-primary">
                  Add to Cart
                </button>
              </div>
            )}
            <button onClick={() => navigate('/')} className="btn btn-secondary mt-3">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;
