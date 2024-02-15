import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa"


function AppEvents() {
  const [eventsData, setEventsData] = useState([]);
  const [active, setActive] = useState(1);

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/events/`)
      .then(response => {
        setEventsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  return (
    <section id="events" className="block events-block">
      <Container fluid>
        <div className="title-holder">
          <h2>EVENTS</h2>
          <div className="subtitle">browse and be there</div>
        </div>
        <Row className='portfoliolist'>
          {eventsData.map(event => (
            <Col sm={4} key={event.id}>
              <div className='portfolio-wrapper'>
                {/* Use Link to navigate to the specific event page */}
                <Link to={`/events/${event.id}`} className="card-link">
                  <Card >
                    <Card.Img variant="top" src={event.image} />
                    <Card.Body>
                      <div className='label text-center'>
                      <h3 style={{ fontFamily: 'Montserrat', color: '#8f0000', fontSize:'30px' }}>{event.name}</h3>
                        <p style={{ color: 'grey' }}>
                        <span>
                          <FaMapMarkerAlt style={{ fill: 'pink' }} /> {event.venue}
                        </span>
                      </p>
                      <p style={{ color: 'grey' }}>
                        <span >
                          <FaCalendarAlt style={{ fill: 'pink' }} /> {event.start_date}
                        </span>
                        <span style={{ paddingLeft: '10px' }}>
                          <FaClock style={{ fill: 'pink' }} /> {event.start_time}
                        </span>
                        </p>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
          }

export default AppEvents;