import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Pagination from 'react-bootstrap/Pagination';
import axios from 'axios';

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

  let items = [];
  for (let number = 1; number <= 5; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active} onClick={() => setActive(number)}>
        {number}
      </Pagination.Item>,
    );
  }

  return (
    <section id="events" className="block events-block py-5">
      <Container>
        <h2 className="text-center mb-4">Upcoming Events</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {eventsData.map(event => (
            <Col key={event.id}>
              <Link to={`/events/${event.id}`} className="text-decoration-none">
                <div className="card event-card border-0 shadow">
                  <Image src={event.image} className="card-img-top" alt={event.name} />
                  <div className="card-body">
                    <h5 className="card-title">{event.name}</h5>
                    <p className="card-text text-muted small mb-1">{event.venue}</p>
                    <p className="card-text text-muted small">{event.date}</p>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-center mt-4">
          <Pagination>{items}</Pagination>
        </div>
      </Container>
    </section>
  );
}

export default AppEvents;
