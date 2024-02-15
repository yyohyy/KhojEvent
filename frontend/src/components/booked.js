import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
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
        <div className="container">
        <div className="row">
          <div className="col-md-3">
            <ProfileSidebar />
          </div>
          <div className="col-md-9">
            <h1 className="my-4">Booked Tickets</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Ticket Name</th>
                        <th>Status</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookedTickets.map(ticket => (
                        <tr key={ticket.id}>
                            <td>{ticket.ticket.name}</td>
                            <td>{ticket.status}</td>
                            <td>{ticket.quantity}</td>
                            <td>{ticket.amount}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(ticket.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
        </div>
        </div>
    );
};

export default BookedTickets;
