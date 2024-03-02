import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';

const Reviews = () => {
    const [events, setEvents] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [newReview, setNewReview] = useState('');

    useEffect(() => {
        // Fetch reviews data
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/attendees/${localStorage.getItem("id")}/reviews/`);
                setEvents(response.data.reviewed_events);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    const handleEditClick = (eventId, reviewContent) => {
        setIsEditing(true);
        setEditingReviewId(eventId);
        // Set the newReview state to the existing review content
        setNewReview(reviewContent);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingReviewId(null);
        setNewReview('');
    };

    const handleSubmit = async (eventId) => {
        try {
            const authToken = localStorage.getItem("Bearer");
            await axios.put(
                `http://127.0.0.1:8000/reviews/${eventId}/`,
                {
                    event: eventId,
                    body: newReview,
                    attendee: localStorage.getItem("id"),
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            // Refetch reviews data
            const response = await axios.get(`http://127.0.0.1:8000/attendees/${localStorage.getItem("id")}/reviews/`);
            setEvents(response.data.reviewed_events);
            // Reset editing mode
            setIsEditing(false);
            setEditingReviewId(null);
            setNewReview('');
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)", background: "#ffffff" }}>
            <Row>
                <Col xs={12} md={3}>
                    <ProfileSidebar />
                </Col>
                <Col xs={12} md={9}>
                    <Container fluid>
                        <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000" }}>Reviews</h1>
                        <div className="shadow-box">
                        <div className="table-responsive">
                        <table className="table table-borderless table-hover">
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{ minWidth: "200px" }}>Event Name</th>
                                        <th className="text-center" style={{ minWidth: "200px" }}>Reviews</th>
                                        <th className="text-center" style={{ minWidth: "150px" }}>Actions</th>
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
                                                {/* Display textarea when editing */}
                                                {isEditing && editingReviewId === event.id ? (
                                                    <textarea
                                                        rows="5"
                                                        value={newReview}
                                                        onChange={(e) => setNewReview(e.target.value)}
                                                    />
                                                ) : (
                                                    <div>{event.review}</div>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {/* Display "Edit" button when not editing */}
                                                {!isEditing && (
                                                    <Button variant="secondary" onClick={() => handleEditClick(event.id, event.review)}>Edit</Button>
                                                )}
                                                {isEditing && editingReviewId === event.id && (
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
                        </div>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default Reviews;
