import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios'

const InterestedEvents = () => {
    const {id}= useParams()
    const [events, setEvents] = useState([]);
    useEffect(() => {
        // Fetch interested events when component mounts
        const authToken = localStorage.getItem("Bearer");
        
        const fetchInterestedEvents = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/interested-detail/${localStorage.getItem("id")}/`,{
                    headers: {
                      Authorization: `Bearer ${authToken}`,
                    },
                  }
                  )
                setEvents(response.data);
            } catch (error) {
                console.error('Error fetching interested events:', error);
            }
        };

        fetchInterestedEvents();

        // Clean up function
        return () => {
            // Perform any cleanup if needed
        };
    }, [id]);
    return (
        <Container>
            <h1 className="my-4">Interested Events</h1>
            <Row>
                {events.map(event => (
                    <Col key={event.id} md={4} className="mb-4">
                        <Card>
                        <Card.Img variant="top" src={event.image} />
                            <Card.Body>
                                <Card.Title>{event.event.name}</Card.Title>
                                <Card.Text>Date: {event.event.start_date}</Card.Text>
                                <Card.Text>Time: {event.event.start_time} - {event.event.end_time}</Card.Text>
                                <Card.Text>Venue: {event.event.venue}</Card.Text>
                                <Card.Text>Description: {event.event.description}</Card.Text>
                               
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};
export default InterestedEvents;
