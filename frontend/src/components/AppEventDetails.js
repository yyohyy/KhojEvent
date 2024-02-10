import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function AppEventDetail() {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();
  const [interested, setInterested] = useState(false); // State variable to manage interest

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/events/${event_id}/`)
      .then(response => {
        setEventsData([response.data]);
        setLoading(false);
        setInterested(response.data.interested); // Update interested state from backend

      })
      .catch(error => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
  }, [event_id]);

  const eventWebsiteUrl = "https://www.google.com/";

  const activeEventData = eventsData[0] || {};


  const handleToggleInterest = () => {
    console.log("Toggling interest for event:", event_id);
    axios.post(`http://127.0.0.1:8000/events/${event_id}/interested/`)
      .then(response => {
        console.log("Toggle interest response:", response.data);
        if (response.data.success) {
          setInterested(prevInterested => !prevInterested); // Toggle interested state
        } else {
          console.error('Error toggling interest:', response.data.error);
        }
      })
      .catch(error => {
        console.error('Error toggling interest:', error);
      });
  }
  
  
  
 // CSS styles
 const styles = {
  wishlistButton: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  wishlistIcon: {
    color: "white", // Color of the heart icon
    fontSize: "20px", // Size of the heart icon
    marginRight: "10px", // Spacing between the heart icon and the label
  },
  wishlistLabel: {
    fontSize: "15px", // Size of the label
  },
};

  return (
    <div>
      <div className="col-md-12">
        {activeEventData.image && (  // Check if the image field is not null
          <img
            className="d-block w-100"
            src={activeEventData.image}  // Assuming "image" is the field containing the image URL
            alt={`Event Image`}
          />
        )}
      </div>
      <div className="mt-3">
              {/* Render the interested button as a wishlist heart */}
              <button
                style={{
                  ...styles.wishlistButton,
                  width: '185px', // Adjust the width as needed
                  height: '40px', // Adjust the height as needed
                  marginTop: '20px',
                  marginBottom: '20px',
                  marginLeft: '1300px'
                  }}
                  onClick={handleToggleInterest}
                >
                  {interested ? (
                    <FaRegHeart style={{ ...styles.wishlistIcon, fontSize: '15px' }} />
                  ) : (
                    <FaHeart style={{ ...styles.wishlistIcon, fontSize: '15px' }} />
                  )}
                  <span style={styles.wishlistLabel}>{interested ? "Remove from it " : "Add to Interested"}</span>
                </button>
              </div>
         <div className="col-md-100">
        <div className="card p-5">
            <h1 className="card-title">{activeEventData.name}</h1>
            <p className="card-text">{activeEventData.description}</p>
            <div className="d-flex align-items-center mt-3">
              <span className="me-3">
                <FaCalendarAlt /> {activeEventData.start_date}
              </span>
              <span className="me-3">
                <FaClock /> {activeEventData.start_time}
              </span>
              <span>
                <FaMapMarkerAlt /> Event Location: {activeEventData.venue}
              </span>
            </div>
            </div>
            </div>
            <span className="mt-5">
              <FaExternalLinkAlt />{" "}
              <a
                href={eventWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                For more details, visit the event website
              </a>
            </span>
          </div>

  );
}

export default AppEventDetail;
