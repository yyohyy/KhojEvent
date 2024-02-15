import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);
    const [newReview, setNewReview] = useState('');

    useEffect(() => {
        // Fetch reviews data
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/attendee-reviews/${localStorage.getItem("id")}/`);
                setReviews(response.data.reviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchReviews();
    }, []);

    const handleEditClick = (reviewId) => {
        setIsEditing(true);
        setEditingReviewId(reviewId);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingReviewId(null);
        setNewReview('');
    };

    const handleSubmit = async (reviewId) => {
        try {
            const authToken = localStorage.getItem("Bearer");
            await axios.put(
                `http://127.0.0.1:8000/reviews/${reviewId}/`,
                {
                    review: newReview,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            // Refetch reviews data
            const response = await axios.get(`http://127.0.0.1:8000/attendee-reviews/${localStorage.getItem("id")}/`);
            setReviews(response.data.reviews);

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
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={9}>
                    <Container fluid>
                        <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000" }}>Reviews</h1>
                        <div className="shadow-box">
                            <Table responsive bordered hover>
                                <thead>
                                    <tr>
                                        <th className="text-center">Event Name</th>
                                        <th className="text-center">Review</th>
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
                                    {reviews.map(review => (
                                        <tr key={review.id}>
                                            <td className="text-center">
                                                {/* Wrap event name in Link component */}
                                                <Link to={`/events/${review.event.id}`}>
                                                    {review.event.name}
                                                </Link>
                                            </td>
                                            <td className="text-center">
                                                {/* Display input field when editing */}
                                                {isEditing && editingReviewId === review.id ? (
                                                    <input
                                                        type="text"
                                                        value={newReview}
                                                        onChange={(e) => setNewReview(e.target.value)}
                                                    />
                                                ) : (
                                                    <div>{review.body}</div>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {/* Display "Edit" button when not editing */}
                                                {!isEditing && (
                                                    <Button variant="secondary" onClick={() => handleEditClick(review.id)}>Edit</Button>
                                                )}
                                                {isEditing && editingReviewId === review.id && (
                                                    <Button variant="success" onClick={() => handleSubmit(review.id)}>Submit</Button>
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
                            </Table>
                        </div>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default Reviews;
