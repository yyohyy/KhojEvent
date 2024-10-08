import React, { useState, useEffect } from 'react';
import { Container, Row, Col , Button } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileSidebar from './ProfileSidebar';

const UpdateEvent = () => {
    const navigate = useNavigate();
    const { organiser_id } = useParams();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchOrganiserEvents = async () => {
            try {
                const authToken = localStorage.getItem("Bearer");
                const response = await axios.get(`http://127.0.0.1:8000/users/${localStorage.getItem("id")}/events/`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching organiser events:', error);
            }
        };

        fetchOrganiserEvents();

        return () => {
            // Clean up function if needed
        };
    }, [organiser_id]);

    const handleEventUpdate = (event_id) => {
        navigate(`/profile/${localStorage.getItem("id")}/events/update/${event_id}`);
    };

        // Define handleEditTicketType function
    const handleViewAnalytics = (eventId) => {
        navigate(`/profile/${localStorage.getItem("id")}/events/${eventId}/analytics`);
    };


    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)", background: "#ffffff" }}>
            <div class="custom-container"></div>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={9}>
                <div style={{ padding: '20px' }}>
                    <h1 className="my-4"style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000"}}>Organized Events:</h1>
                    </div>
                    {events.length > 0 ? (
                        <div className="shadow-box">
                            <div className="table-responsive">
  <table className="table table-borderless table-hover">
    <thead>
        <tr>
            <th>Event Name</th>
            <th>Date</th>
            {/* <th>Time</th> */}
            <th>Venue</th>
            <th>Status</th>
            <th>Entry</th>
            <th className="text-center" >Tickets</th> {/* Add heading for the "Edit Tickets" column */}
            <th>Actions</th>
        </tr>
        <tr className="table-heading-line">
            <th colSpan="8"></th> {/* Empty cell for the line */}
        </tr>
    </thead>
    <tbody>
        {events.map(event => (
            <tr key={event.id}>
                                        <td>
                                            {/* Wrap event name in Link component */}
                                            <Link to={`/events/${event.id}`}>
                                                {event.name}
                                            </Link>
                                        </td>
                <td>{event.start_date}</td>
                {/* <td>{event.start_time} - {event.end_time}</td> */}
                <td>{event.venue}</td>
                <td>{event.is_approved ? "Approved" : "Not Approved"}</td>
                <td>{event.is_paid ? "Paid" : "Free"}</td>
                <td style={{ padding: "10px", textAlign: "center" }}> {/* Add inline style to adjust padding */}
                    <Button variant="success" onClick={() => handleViewAnalytics(event.id)}>View Analytics</Button>
                </td>
                <td>
                    <Button variant="danger" onClick={() => handleEventUpdate(event.id)}>Update </Button>
                </td>
            </tr>
        ))}
    </tbody>
</table>
</div>
                        </div>
                    ) : (
                        <p>No organized events available</p>
                    )}
                
                </Col>
            </Row>
                            
        </Container>
    );
};

export default UpdateEvent;
