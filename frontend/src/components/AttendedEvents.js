import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileSidebar from './ProfileSidebar';

const AttendedEvents = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchAttendedEvents = async () => {
            try {
                const authToken = localStorage.getItem("Bearer");
                const response = await axios.get(`http://127.0.0.1:8000/users/events/`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching attended events:', error);
            }
        };

        fetchAttendedEvents();

        return () => {
            // Clean up function if needed
        };
    }, []);

    const handleEventClick = (eventId) => {
        navigate(`/events/${eventId}`);
    };


    const handleLeaveFeedbackClick = (eventId) => {
        navigate(`/profile/${localStorage.getItem("id")}/leave-feedback/${eventId}`);
    };

    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)", background: "#ffffff" }}>
            <div className="custom-container"></div>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={9}>
                    <div style={{ padding: '20px' }}>
                        <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000" }}>Attended Events</h1>
                    </div>

                    {events.length > 0 ? (
                        <div className="shadow-box">
                           <table className="table table-borderless table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center">Event Name</th>
                                   
                                        <th className="text-center">Feedback</th>
                                    </tr>
                                    <tr className="table-heading-line">
                                        <th colSpan="5"></th> {/* Empty cell for the line */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {events.map(event => (
                                        <tr key={event.id}>
<td className="text-center" onClick={() => handleEventClick(event.id)} style={{ cursor: 'pointer' }}>{event.name}</td>
                                            {/* <td className="text-center">
                                                <Button variant="success" onClick={() => handleOrderClick(event.id)}>View Orders</Button>
                                            </td> */}
                                            <td className="text-center">
                                                <Button variant="secondary" onClick={() => handleLeaveFeedbackClick(event.id)}>Leave Feedback</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No attended events available</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default AttendedEvents;
