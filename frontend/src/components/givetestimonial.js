import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import ProfileSidebar from './ProfileSidebar'; // Assuming ProfileSidebar is in the same directory

const OrgansierTestimonial = () => {
    // State variables for managing OrganiserTestimonial data, loading state, error messages, and submission status
    const [testimonial, setTestimonial] = useState('');
    const [existingTestimonial, setExistingTestimonial] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // // Fetch testimonial data when the component mounts
    // useEffect(() => {
    //     const fetchTestimonial = async () => {
    //         try {
    //             // Fetch testimonial data from the backend API
    //             const authToken = localStorage.getItem("Bearer");
    //             const testimonialResponse = await axios.get(`http://127.0.0.1:8000/testimonials`, {
    //                 headers: {
    //                     Authorization: `Bearer ${authToken}`,
    //                 },
    //             });

    //             // Set the existing testimonial data in the state
    //             setExistingTestimonial(testimonialResponse.data.body);
    //         } catch (error) {
    //             // Handle any errors that occur during fetching
    //             console.error('Error fetching testimonial:', error);
    //             setErrorMessage("Error fetching testimonial. Please try again later.");
    //         }
    //     };
    //     fetchTestimonial();
    // }, []);

    // Update the testimonial state when existing testimonial data changes
    // useEffect(() => {
    //     if (existingTestimonial !== null) {
    //         setTestimonial(existingTestimonial);
    //     }
    // }, [existingTestimonial]);

    // Event handler for updating testimonial state
    // const handleTestimonialChange = (e) => {
    //     setTestimonial(e.target.value);
    // };

    // Event handler for form submission
// Event handler for form submission
// Event handler for form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setLoading(true);
        // Fetch JWT token from local storage for authentication
        const authToken = localStorage.getItem("Bearer");
        const organiser=localStorage.getItem("id")
        const headers = {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
        // Send only the testimonial data
        await axios.post(`http://127.0.0.1:8000/testimonial/create/`, { content: testimonial,organiser: organiser }, headers);
        console.log('Testimonial submitted successfully');
        // Set the submission status to true
        setSubmitted(true);
    } catch (error) {
        // Handle any errors that occur during submission
        console.error('Error submitting testimonial:', error);
        setErrorMessage("Error submitting testimonial. Please try again later.");
    } finally {
        setLoading(false);
    }
};

    // JSX structure for the Testimonial component
    return (
        <Container fluid style={{ minHeight: "calc(100vh - 56px)", paddingBottom: "50px" }}>
            <Row>
                <Col sm={3}>
                    <ProfileSidebar />
                </Col>
                <Col sm={8} style={{ boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)" }}>
                    <div style={{ padding: '20px 0' }}>
                        <h1 className="my-4" style={{ fontFamily: "Comfortaa, cursive", color: "#8B0000", paddingLeft: "20px", textAlign: "center" }}>Leave Testimonial</h1>
                    </div>
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    {/* Testimonial form */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formTestimonial" style={{ paddingLeft: '50px', paddingRight: '50px' }}>
                            <h3>Testimonial:</h3>
                            <Form.Control as="textarea" rows={6} value={testimonial} onChange={(e) => setTestimonial(e.target.value)} />
                        </Form.Group>
                        {/* Submit button */}
                        <Button variant="primary" type="submit" disabled={loading || submitted} style={{ marginTop: '10px', marginBottom: '20px', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>
                            {submitted ? 'Submitted' : 'Submit'}
                        </Button>
                    </Form>
                    {/* Display error message if there's an error */}
                    {error && <p className="mt-3 text-danger">Error: {error}</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default OrgansierTestimonial;
