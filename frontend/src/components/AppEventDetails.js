import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function AppEventDetail() {
  const [eventData, setEventData] = useState({});
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/events/${event_id}/`)
      .then(response => {
        setEventData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
  }, [event_id]);

  const eventWebsiteUrl = "https://www.google.com/";

  const handleBooking = () => {
    // Perform booking logic here
    // After booking, navigate to the booking page
    navigate(`/booking/${eventData.id}`);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card border-0 shadow-lg p-5">
            <h1 className="card-title text-center">{eventData.name}</h1>
            <img src={eventData.image} alt="Event" className="img-fluid rounded mb-4" />
            <p className="card-text text-center">{eventData.description}</p>
            <div className="text-center">
              <div className="d-inline-block me-3">
                <FaCalendarAlt /> {eventData.start_date}
              </div>
              <div className="d-inline-block me-3">
                <FaClock /> {eventData.start_time}
              </div>
              <div className="d-inline-block">
                <FaMapMarkerAlt /> {eventData.venue}
              </div>
            </div>
            <div className="text-center mt-4">
              <a
                href={eventWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                <FaExternalLinkAlt className="me-2" />
                Visit Event Website
              </a>
            </div>
            <div className="text-center mt-4">
              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleBooking}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppEventDetail;
