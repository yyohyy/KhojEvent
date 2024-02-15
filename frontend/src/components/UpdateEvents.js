import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
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
        navigate(`/profile/${organiser_id}/events/update/${event_id}`);
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <ProfileSidebar />
                </div>
                <div className="col-md-9">
                    <Container fluid>
                        <h1 className="my-4">Organizer Events</h1>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Event Name</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Venue</th>
                                    <th>Actions</th>
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
                                            <Button variant="primary" onClick={() => handleEventUpdate(event.id)}>Update</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                </div>
            </div>
        </div>
    );
};

export default UpdateEvent;
