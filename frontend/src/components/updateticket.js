import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from './axios';
import ProfileSidebar from './ProfileSidebar';

const UpdateTicket = () => {
  const navigate = useNavigate();
  const { event_id } = useParams();

  const [ticketDetails, setTicketDetails] = useState(null);
  const [formData, setFormData] = useState({
    max_limit: '',
    ticketTypes: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('Bearer');
    if (token) {
      AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Fetch ticket details
    AxiosInstance.get(`http://127.0.0.1:8000/tickets/${event_id}/`)
      .then(response => {
        setTicketDetails(response.data);
        setFormData({
          event: response.data.event,
          max_limit: response.data.max_limit,
          ticketTypes: response.data.ticket_types.map(ticketType => ({
            id: ticketType.id,
            name: ticketType.name,
            description: ticketType.description,
            price: ticketType.price,
            quantity: ticketType.quantity,
          })),
        });
      })
      .catch(error => {
        console.error('Error fetching ticket details:', error);
      });
  }, [event_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTicketTypeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTicketTypes = [...formData.ticketTypes];
    updatedTicketTypes[index][name] = value;
  
    // Calculate new quantity_available
    const quantity = parseInt(value); // Convert value to integer
    const quantity_available = quantity; // You can customize this calculation as per your requirements
  
    // Update the quantity_available in the corresponding ticket type
    updatedTicketTypes[index]['quantity_available'] = quantity_available;
  
    setFormData({ ...formData, ticketTypes: updatedTicketTypes });
  };
  

  const addTicketType = () => {
    setFormData((prevState) => ({
      ...prevState,
      ticketTypes: [...prevState.ticketTypes, { name: '', description: '', price: '', quantity: '' }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedFormData = {
        ...formData,
        ticket_types: formData.ticketTypes
      };
      // Patch the ticket details
      await AxiosInstance.patch(`http://127.0.0.1:8000/tickets/${event_id}/`, updatedFormData);
      console.log('Ticket updated successfully');
      navigate(`/profile/${localStorage.getItem("id")}/events/update/${event_id}`); // Redirect to the event update page after ticket update
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  };

  return (
    <Container fluid style={{ minHeight: "calc(100vh - 56px)", background: "#ffffff" }}>
      <Row>
        <Col sm={3}>
          <ProfileSidebar />
        </Col>
        <Col sm={9}>
          <Card className="shadow-box">
            <Card.Body>
              <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000" }}>Update Ticket</h1>
              <form onSubmit={handleSubmit}>
                <label>
                  Max Limit:
                  <input type="number" name="max_limit" value={formData.max_limit} onChange={handleInputChange} />
                </label>

                {/* Ticket Types */}
                <div className="ticket-types-container">
                  <h4>Add Ticket Types</h4>
                  {formData.ticketTypes.map((ticket, index) => (
                    <div key={index} className="ticket-type ">
                      <button type="button" className="accordion">
                        Ticket Type {index + 1}
                      </button>
                      <div className="panel mt-4">
                        <label>
                          Name:
                          <input
                            type="text"
                            name="name"
                            value={ticket.name}
                            onChange={(e) => handleTicketTypeChange(index, e)}
                          />
                        </label>
                        <label>
                          Description:
                          <input
                            type="text"
                            name="description"
                            value={ticket.description}
                            onChange={(e) => handleTicketTypeChange(index, e)}
                          />
                        </label>
                        <label>
                          Price:
                          <input
                            type="number"
                            name="price"
                            value={ticket.price}
                            onChange={(e) => handleTicketTypeChange(index, e)}
                          />
                        </label>
                        <label>
                          Quantity:
                          <input
                            type="number"
                            name="quantity"
                            value={ticket.quantity}
                            onChange={(e) => handleTicketTypeChange(index, e)}
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                   <div className="mb-3"></div>
                  {/* <button type="button" onClick={addTicketType}>
                    Add Ticket Type
                  </button> */}
                </div>

                <Button type="submit">Update</Button>
              </form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateTicket;
