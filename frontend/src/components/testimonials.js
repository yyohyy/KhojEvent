import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';

function AppTestimonials() {
  const [testimonialsData, setTestimonialsData] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/testimonials');
        setTestimonialsData(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Handle error fetching testimonials
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="testimonials-block mb-">
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Container fluid style={{ flexGrow: 1 }}>
          <div className="title-holder">
            <h2>Client testimonials</h2>
            <div className="subtitle">what client says about us</div>
          </div>
          <Carousel controls={false}>
            {testimonialsData.map(testimonial => (
              <Carousel.Item key={testimonial.id}>
                <blockquote>
                  <p>{testimonial.description}</p>
                  <cite>
                    <span className='name'>{testimonial.name}</span>
                    <span className='designation'>{testimonial.designation}</span>
                  </cite>
                </blockquote>             
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </div>
    </section>
  );
}

export default AppTestimonials;
