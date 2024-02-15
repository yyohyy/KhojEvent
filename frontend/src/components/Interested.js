import React, { useState, useEffect } from 'react';
import { Container,  Button, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileSidebar from './ProfileSidebar';

const InterestedEvents = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchInterestedEvents = async () => {
            try {
                const authToken = localStorage.getItem("Bearer");
                const response = await axios.get(`http://127.0.0.1:8000/interested-detail/${localStorage.getItem("id")}/`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching interested events:', error);
            }
        };

        fetchInterestedEvents();

        return () => {
            // Clean up function if needed
        };
    }, [id]);

    const handleEventClick = (eventId) => {
        navigate(`/events/${eventId}`);
    };

    const handleRemoveClick = async (eventId) => {
        try {
            const authToken = localStorage.getItem("Bearer");
            await axios.delete(`http://127.0.0.1:8000/remove-event/${eventId}/`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            // After removing event, refetch the interested events
            const response = await axios.get(`http://127.0.0.1:8000/interested-detail/${localStorage.getItem("id")}/`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setEvents(response.data);
        } catch (error) {
            console.error('Error removing event:', error);
        }
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
                    <h1 className="my-4"style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000"}}>Interested Events</h1>
                    </div>
                    
                    {events.length > 0 ? (
                        <div className="shadow-box">
                         <table class="table table-borderless table-hover">
                            <thead>
                                <tr>
                                    <th class="text-center" >Event Name</th>
                                    <th class="text-center">Date</th>
                                    <th class="text-center">Time</th>
                                    <th class="text-center">Venue</th>
                                    <th class="text-center">Interested Status</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                                                <tr className="table-heading-line">
                    <th colSpan="6"></th> {/* Empty cell for the line */}
                </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event.event.id}>
                                        <td class="text-center">{event.event.name}</td>
                                        <td class="text-center">{event.event.start_date}</td>
                                        <td class="text-center">{event.event.start_time} - {event.event.end_time}</td>
                                        <td class="text-center">{event.event.venue}</td>
                                        <td class="text-center">
                                            <Button variant="danger" onClick={() => handleRemoveClick(event.event.id)}>Remove</Button>
                                        </td>
                                        <td class="text-center">
                                            <Button variant="secondary" onClick={() => handleEventClick(event.event.id)}>View Details</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    ) : (
                        <p>No interested events available</p>
                    )}
                </Col>
            </Row>
                            
        </Container>
    );
};

export default InterestedEvents;