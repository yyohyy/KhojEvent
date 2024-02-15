import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col ,Card} from 'react-bootstrap';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa"
import ProfileSidebar from './ProfileSidebar'; // Assuming ProfileSidebar is in the same directory

const Feedback = () => {
    const { eventId } = useParams();
    const [eventData, setEventData] = (useState(null)); 
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [existingRating, setExistingRating] = useState(null);
    // const [existingReview, setExistingReview] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate=useNavigate()

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
                console.log(eventData)
                // Fetch existing rating
                const ratingResponse = await axios.get(`http://127.0.0.1:8000/event-ratings/${eventId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setExistingRating(ratingResponse.data.stars);
                // // Fetch existing review
                // const reviewResponse = await axios.get(`http://127.0.0.1:8000/events/${eventId}/reviews/`, {
                //     headers: {
                //         Authorization: `Bearer ${authToken}`,
                //     },
                // });
                // console.log(existingReview)
                // setExistingReview(reviewResponse.data.body);
                // console.log(reviewResponse.data.body)
                // console.log(existingReview)
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
            console.log(parseFloat(ratingNumber));
        }
        
        // if (existingReview) {
        //     setReview(existingReview);
        //     console.log(existingReview)
        // }
    }, [existingRating]); //, existingReview

    const handleRatingChange = (newRating) => {
        if (!isNaN(newRating)) {
            setRating(newRating);
        }
    };

    // const handleReviewChange = (e) => {
    //     setReview(e.target.value);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const authToken = localStorage.getItem("Bearer");
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            };
            // Update or create rating
            if (existingRating) {
                await axios.patch(`http://127.0.0.1:8000/event-ratings/${eventId}/`, {event: eventId, rating: rating,attendee:localStorage.getItem("id") }, config);
            } else {
                await axios.post(`http://127.0.0.1:8000/rate-event/`, { event: eventId, rating: rating }, config);
            }
            // Update or create review
            // if (existingReview) {
            //     await axios.patch(`http://127.0.0.1:8000/reviews/${eventId}/`, { review: review }, config);
            // } else {
            //     await axios.post(`http://127.0.0.1:8000/reviews/`, { event: eventId, review: review }, config);
            // }
            console.log('Feedback submitted successfully');
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
        <Container fluid style={{ minHeight: "calc(100vh - 56px)" }}>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={9}>
                {eventData && (
        <Card>
        <Row>
        <div className="mt-5 mb-5 shadow p-3 rounded mx-auto" style={{ width: '600px' }}>
  <div>
    <div className="d-flex align-items-center">
            <Col sm={5}>
                <Card.Img variant="top" src={eventData.image} alt={eventData.name} />
            </Col>
            <Col sm={8}>
                <Card.Body>
                    <Card.Title>{eventData.name}</Card.Title>
                    <Card.Text>
                        <span><FaMapMarkerAlt style={{ fill: 'red' }} /> {eventData.venue} </span>
                        <span><FaCalendarAlt style={{ fill: 'red' }} />  {eventData.start_time} </span>
                    </Card.Text>
                    <Button variant="primary" onClick={redirectToEventPage}>View Details</Button>
                </Card.Body>

            </Col>
            </div>
                </div>
                </div>
        </Row>
    </Card>
                    )}
                    <div style={{ padding: '20px' }}>
                        <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000" }}>Leave Feedback</h1>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formRating">
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
                        {/* <Form.Group controlId="formReview">
                            <Form.Label>Review</Form.Label>
                            <Form.Control as="textarea" rows={3} value={review} onChange={handleReviewChange} />
                        </Form.Group> */}
<Button variant="primary" type="submit" disabled={loading} style={{ marginTop: '10px' }}>
    {loading ? 'Submitting...' : 'Submit'}
</Button>

                    </Form>
                    {error && <p>Error: {error}</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default Feedback;
