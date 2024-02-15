import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';



const Ratings = () => {
    const [events, setEvents] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null);
    const [newRating, setNewRating] = useState(0);

    useEffect(() => {
        // Fetch ratings data
        const fetchRatings = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/attendee-rated-events/${localStorage.getItem("id")}/`);
                setEvents(response.data.rated_events);
            } catch (error) {
                console.error('Error fetching ratings:', error);
            }
        };

        fetchRatings();
    }, []);

    const handleEditClick = (eventId) => {
        setIsEditing(true);
        setEditingEventId(eventId);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingEventId(null);
        setNewRating(0);
    };

    const handleSubmit = async (eventId) => {
        try {
            const authToken = localStorage.getItem("Bearer");
            await axios.put(
                `http://127.0.0.1:8000/event-ratings/${eventId}/`,
                {
                    event: eventId,
                    stars: newRating,
                    attendee: localStorage.getItem("id"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            // Refetch ratings data
            const response = await axios.get(`http://127.0.0.1:8000/attendee-rated-events/${localStorage.getItem("id")}/`);
            setEvents(response.data.rated_events);

            // Reset editing mode
            setIsEditing(false);
            setEditingEventId(null);
            setNewRating(0);
        } catch (error) {
            console.error('Error updating rating:', error);
        }
    };

    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)", background: "#ffffff" }}>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={9}>
                    <Container fluid>
                        <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000" }}>Ratings</h1>
                        <div className="shadow-box">
                        <table className="table table-borderless table-hover">
                            <thead>
                                <tr>
                                    <th className="text-center">Event Name</th>
                                    <th className="text-center">Rating</th>
                                    <th className="text-center">Actions</th>
                                    {isEditing && (
                                        <th className="text-center">Cancel</th>
                                    )}
                                </tr>
                                <tr className="table-heading-line">
                                        <th colSpan="5"></th> {/* Empty cell for the line */}
                                    </tr>
                            </thead>
                            <tbody>
                                {events.map(event => (
                                    <tr key={event.id}>
                                        <td className="text-center">
                                            {/* Wrap event name in Link component */}
                                            <Link to={`/events/${event.id}`}>
                                                {event.name}
                                            </Link>
                                        </td>
                                        <td className="text-center">
                                            {/* Display StarRatings component when editing */}
                                            {isEditing && editingEventId === event.id ? (
                                                <StarRatings
                                                    rating={newRating}
                                                    starRatedColor="orange"
                                                    starDimension="20px"
                                                    starSpacing="2px"
                                                    numberOfStars={5}
                                                    changeRating={(newRating) => setNewRating(newRating)}
                                                />
                                            ) : (
                                                <div>
                                                    <StarRatings
                                                        rating={event.rating}
                                                        starRatedColor="orange"
                                                        starDimension="20px"
                                                        starSpacing="2px"
                                                        numberOfStars={5}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {/* Display "Change" button when not editing */}
                                            {!isEditing && (
                                                <Button variant="secondary" onClick={() => handleEditClick(event.id)}>Change</Button>
                                            )}
                                            {isEditing && editingEventId === event.id && (
                                                <Button variant="success" onClick={() => handleSubmit(event.id)}>Submit</Button>
                                            )}
                                        </td>
                                        {isEditing && (
                                            <td className="text-center">
                                                <Button variant="danger" onClick={() => handleCancel()}>Cancel</Button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        </div>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default Ratings;
