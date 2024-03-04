import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaChevronRight } from "react-icons/fa";

import img1 from '../assets/images/img1.jpg';

const AppHero = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/events/');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 3) % events.length);
  };

  const heroData = [
    {
      id: 1,
      image: require('../assets/images/img-hero1.jpg'),
      title: 'Find the Events with Us',
      description: 'Welcome to KhojEvent, your one-stop destination for seamless event planning and management! At KhojEvent, we understand the importance of creating unforgettable moments, and our user-friendly website is designed to streamline the entire event management process.',
      link: 'http://localhost:3000/events'
    },
    {
      id: 2,
      image: require('../assets/images/img-hero2.jpg'),
      title: 'Book the Tickets ',
      description: 'Enjoy the peace of mind that comes with our secure online payment system. Purchase tickets with confidence, knowing that your transaction is protected and your information is handled with the utmost care.!',
      link: 'http://localhost:3000/events/paid'
    },
    {
      id: 3,
      image: require('../assets/images/img-hero3.jpg'),
      title: 'Promote your Event ',
      description: 'Introducing EventBoost – Amplify Your Experience! Unlock the full potential of your events with our powerful promotion tools that guarantee heightened visibility and attendance. Create a buzz around your event by leveraging our strategic promotional features. Craft eye-catching event pages with customizable designs, compelling descriptions, and vibrant multimedia content. Showcase what makes your event unique and irresistible to potential attendees.',
      link: 'http://localhost:3000/create-event'
    }
  ];

  return (
    <section id="home" className="hero-block" style={{ backgroundColor: '#fff' }}>
      <Carousel>
        {heroData.map(hero => (
          <Carousel.Item key={hero.id}>
            <img
              className="d-block w-100"
              src={hero.image}
              alt={"slide " + hero.id}
            />
            <Carousel.Caption>
              <h2>{hero.title}</h2>
              <p>{hero.description}</p>
              <a className="btn btn-primary" href={hero.link}>Learn More <i className="fas fa-chevron-right"></i></a>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      <Container fluid>
        <div className="title-holder mt-4" >
          <h2>About Us</h2>
          <div className="subtitle">learn more about us</div>
        </div>
        <Row>
          <Col sm={6}>
            <Image src={img1} />
          </Col>
          <Col sm={6}>
            <p>KhojEvent is more than just a website; it's a dynamic ecosystem. Dive into our curated vendor directory, explore insightful blogs, connect with fellow organizers in our community forum, and discover the latest trends shaping the world of events.
              At the heart of KhojEvent is a team driven by passion and a shared love for celebrations. We're here to support you at every step, providing resources, inspiration, and a helping hand to ensure your events are nothing short of spectacular</p>
            <p>Join us on this exciting journey as we redefine the art of event planning. KhojEvent – Where Every Occasion Becomes an Extraordinary Experience. Start planning with us and let your events take center stage.</p>

          </Col>
        </Row>
      </Container>
      <Container fluid>
        <div className="title-holder mt-4">
          <h2>Coming Soon</h2>
          <div className="subtitle">Stay Tuned</div>
        </div>
        <div className='carouselbg' style={{backgroundColor: 'white'}}>
        <Carousel
          interval={null}
          indicators={false}
          nextIcon={<span className="carousel-control-next-icon" />}
          prevIcon={<span className="carousel-control-prev-icon" />}
          bg="light" style={{backgroundColor: 'white'}}
        >
          {events.map((event, index) => (
            <Carousel.Item key={event.id} active={index >= currentIndex && index < currentIndex + 3}>
              <Row>
                {events.slice(index, index + 3).map(event => (
                  <Col key={event.id} xs={12} sm={6} md={4}>
                    <div className='portfolio-wrapper'>
                      <Card>
                        <Card.Img variant="top" src={event.image}  style={{ height: '200px', objectFit: 'cover'}}/>
                        <Card.Body>
                          <h3 style={{ fontFamily: 'Montserrat', color: '#8f0000', fontSize:'30px' }}>{event.name}</h3>
                          <p style={{ color: 'grey' }}>
                            <span><FaMapMarkerAlt style={{ fill: 'pink' }} /> {event.venue}</span>
                          </p>
                          <p style={{ color: 'grey' }}>
                            <span><FaCalendarAlt style={{ fill: 'pink' }} /> {event.start_date}</span>
                            <span style={{ paddingLeft: '10px' }}><FaClock style={{ fill: 'pink' }} /> {event.start_time}</span>
                          </p>
                          <div className="text-center">
                            <a href={`/events/${event.id}`} className="btn btn-primary">Read More <FaChevronRight style={{ fill: '#888' }} /></a>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
        </div>
      </Container>
    </section>
  );
};

export default AppHero;
