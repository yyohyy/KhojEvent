import React, { useState, useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaCalendarAlt,FaUsers } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import ProfileSidebar from './ProfileSidebar';

function EventAnalytics() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [interestedCount, setInterestedCount] = useState(0);
  const [ratingsAndReviewsData, setRatingsAndReviewsData] = useState([]);

  useEffect(() => {
    // Fetch event data
    axios.get(`http://127.0.0.1:8000/events/${eventId}`)
      .then(response => {
        setEvent(response.data);
      })
      .catch(error => {
        console.error('Error fetching event data:', error);
      });

    // Fetch tickets data
    axios.get(`http://127.0.0.1:8000/tickets/${eventId}`)
      .then(response => {
        setTickets(response.data);
        setTicketTypes(response.data.ticket_types);
      })
      .catch(error => {
        console.error('Error fetching tickets data:', error);
      });

    // Fetch interested count
    axios.get(`http://127.0.0.1:8000/events/${eventId}/count/`)
      .then(response => {
        setInterestedCount(response.data.interested_count);
      })
      .catch(error => {
        console.error('Error fetching interested count:', error);
      });

    axios.get(`http://127.0.0.1:8000/events/${eventId}/ratings-and-reviews/`)
    .then(response => {
      setRatingsAndReviewsData(response.data);
    }) .catch (error=> {
      console.error('Error fetching ratings and reviews:', error);
    });

  }, [eventId]);

  const combinedData = ticketTypes.map(ticket => ({
    name: ticket.name,
    'Tickets Sold': ticket.quantity - ticket.quantity_available,
    'Tickets Remaining': ticket.quantity_available
  }));
  return (
    <Container fluid style={{ minHeight: "calc(100vh - 56px)", paddingBottom: "50px" }}>
    <Row>
        <Col sm={3}>
            <ProfileSidebar />
        </Col>
        <Col sm={8} style={{ boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)" }}>
    <div>
    {event && (
        <Card className="mt-5" style={{ maxWidth: "500px", margin: "0 auto" }}>
    <Card.Body className="d-flex align-items-center">
        <div style={{ paddingRight: "20px" }}>
            <Card.Img src={event.image} alt={event.name} style={{ width: '250px', height: '150px', objectFit: 'cover' }} />
        </div>
        <div>
            <Card.Title>{event.name}</Card.Title>
            <Card.Text>
                <span><FaMapMarkerAlt style={{ marginRight: '5px' }} /> Venue: {event.venue}</span>
               <p> <span className="ml-3"><FaCalendarAlt style={{ marginRight: '5px' }} /> Start Date: {event.start_date}</span></p>
            </Card.Text>
            <Link to={`/events/${eventId}`} className="btn btn-primary">View Details</Link>
        </div>
    </Card.Body>
</Card>
)}
<div className="d-flex justify-content-center">
<Card className="mt-5 p-2" style={{ width: 'fit-content' }}>
  <Card.Body className="d-flex flex-column justify-content-center align-items-center p-2">
    <h3 className="mb-3">Interested Count</h3>
    <div className="d-flex align-items-center">
      <FaUsers size={20} style={{ marginRight: '10px' }} />
      <p className="m-0">{interestedCount}</p>
    </div>
  </Card.Body>
</Card>
</div>
{event && event.is_paid===true && (    
                    <div style={{ textAlign: 'center', color: '#000011',padding:'25px' }}>
    <h3>Tickets Analytics</h3>

    {/* Pie Chart */}
    <div style={{ display: 'inline-block', textAlign: 'left', border: '2px solid #ffb3c1', padding: '20px', borderRadius: '10px' }}>
        <h4 style={{ color: '#000000' }}>Ticket Distribution</h4>
        <PieChart width={400} height={300}>
            <Pie
                data={[
                    { name: 'Tickets Sold', value: tickets.total_quantity - tickets.quantity_available },
                    { name: 'Tickets Remaining', value: tickets.quantity_available }
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#ef233c"
                label
            >
                {[
                    { fill: '#ef233c' },
                    { fill: '#addfff' }
                ].map((entry, index) => (
                    <Cell key={`cell-${index}`} {...entry} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    </div>
</div>
)}
{ticketTypes.length > 0 && (
  <div>
    <h3 style={{ textAlign: 'center', fontSize: '18px' }}>For Ticket Types:</h3>

    <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', padding: '20px', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: 'auto', overflow: 'hidden' }}> 
          <ResponsiveContainer width="100%" height={250}>
      <BarChart data={combinedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Tickets Sold" fill="#7e4794" name="Tickets Sold"  barSize={25}/>
        <Bar dataKey="Tickets Remaining" fill="#a4be5c" name="Tickets Remaining" barSize={25} />
      </BarChart>
    </ResponsiveContainer>
        </div>
    </div>
  </div>
)}



<div style={{ paddingTop: '20px', paddingRight: '50px',paddingLeft:'50px',paddingBottom: '25px' }}>
  <h2 style={{ marginBottom: '30px', marginTop: '50px' }}>Ratings and Reviews:</h2>
  {ratingsAndReviewsData.length > 0 ? (
    ratingsAndReviewsData.map((data, index) => (
      <div key={index} style={{ marginBottom: '10px' }}>
        <div className="d-flex align-items-center">
          <div>
            <StarRatings
              rating={data.details.rating}
              starRatedColor="orange"
              starDimension="20px"
              starSpacing="2px"
              numberOfStars={5}
            />
          </div>
          <div className="ms-2" style={{ paddingLeft: '10px', marginTop: '5px' }}>
          <p style={{ margin: '0', color: '#DEDEDE', fontSize: "15px" }}>
       - {data.details.user_details.attendee_details.first_name} {data.details.user_details.attendee_details.last_name}
    </p>
          </div>
        </div>
        {data.details.review !== null && (
          <p style={{ margin: '10px 0 0', color: 'gray' ,fontSize: "15px", textAlign: 'justify' }}>"{data.details.review}"</p>
        )}
                {data.details.review == null && (
          <p style={{ margin: '10px 0 0', color: 'gray' }}></p>
        )}
      <hr /> 
      </div>
    ))
  ) : (
    <p>No ratings available.</p>
  )}
</div>
</div>
</Col>
    </Row>
        </Container>
  );
}

export default EventAnalytics;
