import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const PurchasedTickets = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const authToken = localStorage.getItem("Bearer");

        const fetchPurchasedTickets = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/users/${localStorage.getItem("id")}/tickets/purchased`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching purchased tickets:', error);
            }
        };

        fetchPurchasedTickets();

        // Clean up function
        return () => {
            // Perform any cleanup if needed
        };
    }, []);

    return (
        <Container>
            <h1 className="my-4">Purchased Tickets</h1>
            <Row>
                {tickets.map(ticket => (
                    <Col key={ticket.id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{ticket.event.name}</Card.Title>
                                <Card.Text>Date: {ticket.event.start_date}</Card.Text>
                                <Card.Text>Time: {ticket.event.start_time} - {ticket.event.end_time}</Card.Text>
                                <Card.Text>Venue: {ticket.event.venue}</Card.Text>
                                <Card.Text>Description: {ticket.event.description}</Card.Text>
                                <Card.Text>Ticket ID: {ticket.id}</Card.Text>
                                <Card.Text>Price: {ticket.price}</Card.Text>
                                <Card.Text>Status: {ticket.status}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PurchasedTickets;
