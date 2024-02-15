import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import ProfileSidebar from './ProfileSidebar';

const PurchasedTickets = () => {
    const [purchasedTickets, setPurchasedTickets] = useState([]);

    const fetchPurchasedTickets = async () => {
        try {
            const authToken = localStorage.getItem("Bearer");
            const response = await axios.get(`http://127.0.0.1:8000/users/${localStorage.getItem("id")}/tickets/purchased/`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setPurchasedTickets(response.data);
        } catch (error) {
            console.error('Error fetching purchased tickets:', error);
        }
    };

    useEffect(() => {
        fetchPurchasedTickets();
    }, []);

    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)" }}>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={9}>
                    <div style={{ padding: '20px' }}>
                        <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000" }}>Purchased Tickets</h1>
                    </div>
                    {purchasedTickets.length > 0 ? (
                        <div className="shadow-box">
                            <table className="table table-borderless table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center">Ticket Name</th>
                                        <th className="text-center">Status</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-center">Amount</th>
                                        <th className="text-center">Actions</th>
                                    </tr>
                                    <tr className="table-heading-line">
                                        <th colSpan="5"></th> {/* Empty cell for the line */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchasedTickets.map(ticket => (
                                        <tr key={ticket.id}>
                                            <td className="text-center">{ticket.ticket.name}</td>
                                            <td className="text-center">{ticket.status}</td>
                                            <td className="text-center">{ticket.quantity}</td>
                                            <td className="text-center">{ticket.amount}</td>
                                            <td className="text-center">
                                                <Link to={`/orders/${ticket.order_id}`} className="btn btn-secondary ms-2">View Order</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No purchased tickets available</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default PurchasedTickets;
