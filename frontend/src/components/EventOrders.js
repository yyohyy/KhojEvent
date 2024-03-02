import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import ProfileSidebar from './ProfileSidebar';

const EventOrders = () => {
    const [orders, setOrders] = useState([]);

    const fetchEventOrders = async () => {
        try {
            const authToken = localStorage.getItem("Bearer");
            // Assuming the event ID is obtained from props or elsewhere
            const eventId = 1;
            const response = await axios.get(`http://127.0.0.1:8000/tickets/${eventId}/orders/${localStorage.getItem("id")}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching event orders:', error);
        }
    };

    useEffect(() => {
        fetchEventOrders();
    }, []);

    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)" }}>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={9}>
                    <div style={{ padding: '20px' }}>
                        <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000" }}>Event Orders</h1>
                    </div>
                    {orders.length > 0 ? (
                        <div className="shadow-box">
                            <table className="table table-borderless table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center">Order ID</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-center">Ticket Name</th>
                                        <th className="text-center">Price</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                    <tr className="table-heading-line">
                                        <th colSpan="5"></th> {/* Empty cell for the line */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id}>
                                            <td className="text-center">{order.ticket.order_id}</td>
                                            <td className="text-center">{order.quantity}</td>
                                            <td className="text-center">{order.ticket.ticket.name}</td>
                                            <td className="text-center">{order.ticket.ticket.price}</td>
                                            <td className="text-center">
                                                <Link to={`/orders/${order.ticket.order_id}`} className="btn btn-secondary">View Order</Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No event orders available</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default EventOrders;
