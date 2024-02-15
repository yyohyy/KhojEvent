import React, { useState, useEffect } from 'react';
import { Container, Row, Col , Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
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

    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)", background: "#ffffff" }}>
            <div class="custom-container"></div>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={9}>
                <div style={{ padding: '20px' }}>
                    <h1 className="my-4"style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000"}}>Organizer Events</h1>
                    </div>
                    {events.length > 0 ? (
                        <div className="shadow-box">
                         <table class="table table-borderless table-hover">
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Venue</th>
                                    <th>Actions</th>
                                </tr>
                                <tr className="table-heading-line">
                    <th colSpan="6"></th> {/* Empty cell for the line */}
                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event.id}>
                                        <td>{event.name}</td>
                                        <td>{event.start_date}</td>
                                        <td>{event.start_time} - {event.end_time}</td>
                                        <td>{event.venue}</td>
                                        <td>
                                            <Button variant="danger" onClick={() => handleEventUpdate(event.id)}>Update</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            </table>
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
