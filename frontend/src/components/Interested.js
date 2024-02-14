import React, { useState, useEffect } from 'react';
import { Container, Table, Col, Button,Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        <Container fluid>
        <Row className="justify-content-end">
        <Col sm={9}>
        <Container>
            <h1 className="my-4">Interested Events</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Event Name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Venue</th>
                        <th>Interested Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event.event.id}>
                            <td>{event.event.name}</td>
                            <td>{event.event.start_date}</td>
                            <td>{event.event.start_time} - {event.event.end_time}</td>
                            <td>{event.event.venue}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleRemoveClick(event.event.id)}>Remove</Button>
                            </td>
                            <td>
                                <Button variant="primary" onClick={() => handleEventClick(event.event.id)}>View Details</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
</Col>
</Row>
</Container>
    );
};

export default InterestedEvents;
