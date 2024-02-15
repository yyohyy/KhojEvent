import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import ProfileSidebar from './ProfileSidebar';

const BookedTickets = () => {
    const [bookedTickets, setBookedTickets] = useState([]);

    const fetchBookedTickets = async () => {
        try {
            const authToken = localStorage.getItem("Bearer");
            const response = await axios.get(`http://127.0.0.1:8000/users/${localStorage.getItem("id")}/tickets/selected/`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setBookedTickets(response.data);
        } catch (error) {
            console.error('Error fetching booked tickets:', error);
        }
    };

    useEffect(() => {
        fetchBookedTickets();
    }, []);

    const handleDelete = async (ticketId) => {
        try {
            console.log(ticketId)
            const authToken = localStorage.getItem("Bearer");
            await axios.delete(`http://127.0.0.1:8000/tickets/cart/${ticketId}/update/`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            // After successful deletion, fetch updated booked tickets
            fetchBookedTickets();
        } catch (error) {
            console.error('Error deleting booked ticket:', error);
        }
    };

    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)", background: "#ffffff" }}>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={9}>
                    <div style={{ padding: '20px' }}>
                        <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000" }}>Booked Tickets</h1>
                    </div>
                  
                    <div className="shadow-box">
                     <table class="table table-borderless table-hover">
                        <thead>
                            <tr>
                                <th className="text-center">Ticket Name</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Quantity</th>
                                <th className="text-center">Amount</th>
                                <th className="text-center">Action</th>
                            </tr>
                            <tr className="table-heading-line">
                            <th colSpan="6"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookedTickets.map(ticket => (
                                <tr key={ticket.id}>
                                    <td className="text-center">{ticket.ticket.name}</td>
                                    <td className="text-center">{ticket.status}</td>
                                    <td className="text-center">{ticket.quantity}</td>
                                    <td className="text-center">{ticket.amount}</td>
                                    <td className="text-center">
                                        <Button variant="danger" onClick={() => handleDelete(ticket.id)}>Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default BookedTickets;
