import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col ,Card} from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa"
import ProfileSidebar from './ProfileSidebar'; // Assuming ProfileSidebar is in the same directory

const Feedback = () => {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null); 
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [existingRating, setExistingRating] = useState(null);
    const [existingReview, setExistingReview] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const authToken = localStorage.getItem("Bearer");
                const eventResponse = await axios.get(`http://127.0.0.1:8000/events/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setEventData(eventResponse.data);

                // Fetch existing rating
                const ratingResponse = await axios.get(`http://127.0.0.1:8000/event-ratings/${eventId}/`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setExistingRating(ratingResponse.data.stars);

                // Fetch existing review
                const reviewResponse = await axios.get(`http://127.0.0.1:8000/reviews/${eventId}/`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setExistingReview(reviewResponse.data.body);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError("Error fetching data. Please try again later.");
            }
        };
        fetchData();
    }, [eventId]);

    useEffect(() => {
        const ratingNumber = Number(existingRating);
        if (!isNaN(parseFloat(ratingNumber))) {
            setRating(parseFloat(ratingNumber));
        }
        
        if (existingReview !== null) {
            setReview(existingReview);
        }
    }, [existingRating, existingReview]);

    const handleRatingChange = (newRating) => {
        if (!isNaN(newRating)) {
            setRating(newRating);
        }
    };

    const handleReviewChange = (e) => {
        setReview(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const authToken = localStorage.getItem("Bearer");
            const headers = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };
            // Update or create rating
            if (existingRating) {
                await axios.patch(`http://127.0.0.1:8000/event-ratings/${eventId}/`, {event: eventId, rating: rating,attendee:localStorage.getItem("id") },headers);
            } else {
                await axios.post(`http://127.0.0.1:8000/rate-event/`, { event: eventId, rating: rating,attendee:localStorage.getItem("id")  },headers);
            }
            // Update or create review
            if (existingReview !== null) {
                await axios.patch(`http://127.0.0.1:8000/reviews/${eventId}/`, {event: eventId,  body: review, attendee:localStorage.getItem("id")  },headers);
            } else {
                await axios.post(`http://127.0.0.1:8000/reviews/`, { event: eventId, body: review ,attendee:localStorage.getItem("id") },headers);
            }
            console.log('Feedback submitted successfully');
            // Set the submission status to true
            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setError("Error submitting feedback. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    const redirectToEventPage = () => {
        // Redirect to the specific event page when the button is clicked
        navigate(`/events/${eventData.id}`);
    };
    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)", paddingBottom: "50px" }}>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={8} style={{ boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)" }}>
                    {eventData && (

<Card className="mt-5" style={{ maxWidth: "500px", margin: "0 auto"  }}>
    <Card.Body className="d-flex align-items-center">
        <div style={{ paddingRight: "20px" }}>
            <Card.Img src={eventData.image} alt={eventData.name} style={{ width: '250px', height: '150px', objectFit: 'cover' }} />
        </div>
        <div>
            <Card.Title>{eventData.name}</Card.Title>
            <Card.Text>
                <span><FaMapMarkerAlt style={{ fill: 'red' }} /> {eventData.venue} </span>
                <span className="ml-3"><FaCalendarAlt style={{ fill: 'red' }} />  {eventData.start_time} </span>
            </Card.Text>
            <Button variant="primary" onClick={redirectToEventPage}>View Details</Button>
        </div>
    </Card.Body>
</Card>



                    )}
                    <div style={{ padding: '20px 0' }}>
                    <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000", paddingLeft: "20px", textAlign: "center" }}>Leave Feedback</h1>


                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formRating"style={{ paddingLeft: '50px', paddingRight: '50px' }}>
                            <h3>Rating:</h3>
                            <StarRatings
                                rating={rating}
                                starRatedColor="orange"
                                starDimension="20px"
                                starSpacing="2px"
                                numberOfStars={5}
                                changeRating={handleRatingChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formReview" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
                            <h3 className='mt-5'>Review</h3>
                            <Form.Control as="textarea" rows={6} value={review} onChange={handleReviewChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading || submitted} style={{ marginTop: '10px', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>
    {submitted ? 'Submitted' : 'Submit'}
</Button>

                    </Form>
                    {error && <p className="mt-3 text-danger">Error: {error}</p>}
                </Col>
            </Row>
        </Container>
    );
    
};

export default Feedback;
