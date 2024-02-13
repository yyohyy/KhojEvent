import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa"

function SearchResults() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("query");

  useEffect(() => {
    if (searchQuery) {
      // Fetch data from the search endpoint
      axios.get(`http://127.0.0.1:8000/search/?query=${searchQuery}`)
        .then(response => {
          // Update the image URLs with the base URL
          const updatedResults = response.data.event_results.map(event => ({
            ...event,
            image: `http://127.0.0.1:8000${event.image}`
          }));
          setSearchResults(updatedResults);
        })
        .catch(error => {
          console.error("Error fetching search results:", error);
        });
    }
  }, [searchQuery]);
  return (
    <section className="min-vh-100 d-flex flex-column justify-content-center">    
    <section id="events" className="block events-block">
      <Container fluid >
        <div className="title-holder">
          <h2>SEARCH RESULTS</h2>
          <div className="text-center" style={{ color: 'grey' }} >
            {searchResults.length > 0 ? (
              <>Showing results for: <span className="query">{searchQuery}</span></>
            ) : searchQuery ? (
              <>No results found for "<span className="query">{searchQuery}</span>"
             <div className="text-center mt-4" color="red">
            <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>Continue browsing</Link>
          </div></>
            ) : (
              <>
                Please enter a search query.
                <div className="text-center mt-4">
            <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>Continue browsing</Link>
          </div>
          </>
            )}
          </div>

        </div>
        <Row className="portfoliolist" >
          {searchResults.map((event) => (
            <Col sm={4} key={event.id}>
              <div className="portfolio-wrapper" >
                {/* Use Link to navigate to the specific event page */}
                <Link to={`/events/${event.id}`} className="card-link">
                  <Card>
                    <Card.Img variant="top" src={event.image} />

                    <Card.Body>
                      <div className="label text-center">
                        <h3 style={{ fontFamily: "Montserrat", color: "#8f0000", fontSize: "30px" }}>
                          {event.name}
                        </h3>
                        <p style={{ color: "grey" }}>
                          <span>
                            <FaMapMarkerAlt style={{ fill: "pink" }} /> {event.venue}
                          </span>
                        </p>
                        <p style={{ color: "grey" }}>
                          <span>
                            <FaCalendarAlt style={{ fill: "pink" }} /> {event.start_date}
                          </span>
                          <span style={{ paddingLeft: "10px" }}>
                            <FaClock style={{ fill: "pink" }} /> {event.start_time}
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
  </section>  
  );
}

export default SearchResults;
