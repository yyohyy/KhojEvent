import React, { useState, useEffect } from "react";
import AxiosInstance from './axios';
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import axios from 'axios';
import StarRatings from 'react-star-ratings';
import { useParams } from 'react-router-dom';

function AppEventDetail() {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [interested, setInterested] = useState(false); // State variable to manage interest
  const [rated, setRated] = useState(false); // State variable to track if the event has been rated

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/events/${event_id}/`)
      .then(response => {
        setEventsData([response.data]);
        setLoading(false);
        setInterested(response.data.interested); // Update interested state from backend
        setRated(response.data.rated); // Update rated state from backend
      })
      .catch(error => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
  }, [event_id]);
  
  const eventWebsiteUrl = "https://www.google.com/";

  const activeEventData = eventsData[0] || {};

  const handleRatingChange = (newRating) => {
    if (!rated) { // Check if the event has been rated
      setRating(newRating);
      const token = localStorage.getItem('token'); // Get the token from wherever you store it (e.g., localStorage)
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json', // Assuming you're sending JSON data
      };
      // Assuming event_id is available in the component's state or props
      const eventData = {
        rating: newRating,
        event_id: event_id,
        stars: newRating, // Assuming stars value is the same as rating initially
        // Pass the event ID to the backend
      };
  
      axios.post(`http://127.0.0.1:8000/rate/`, eventData, { headers })
        .then(response => {
          console.log("Rating added successfully:", response.data);
          setRated(true); // Update rated state to indicate that the event has been rated
        })
        .catch(error => {
          console.error('Error adding rating:', error);
        });
    }
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  }

  const handleSubmitReview = () => {
    // Prepare review data
    const reviewData = {
      body : review
  };

  // Send POST request to backend
  axios.post(`http://127.0.0.1:8000/review-event/${event_id}/`, reviewData)
      .then(response => {
          console.log("Review submitted successfully:", response.data);
          // Optionally, you can update UI or show a success message
      })
      .catch(error => {
          console.error('Error submitting review:', error);
          // Handle error, show error message, etc.
      });
}

  const handleToggleInterest = () => {
    console.log("Toggle interest button clicked");
    // Get the token from wherever you store it (e.g., localStorage)
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    // Configure Axios to include the token in the request headers
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Assuming you're sending JSON data
    };

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
  };

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
        {activeEventData.image && ( // Check if the image field is not null
          <img
            className="d-block w-100"
            src={activeEventData.image} // Assuming "image" is the field containing the image URL
            alt={`Event Image`}
          />
        )}
      </div>
      <div className="mt-3">
        {/* Render the interested button as a wishlist heart */}
        <button
          style={{
            ...styles.wishlistButton,
            width: '140px', // Adjust the width as needed
            height: '40px', // Adjust the height as needed
            marginTop: '20px',
            marginBottom: '20px',
            marginLeft: '1350px'
          }}
          onClick={handleToggleInterest}
        >
          {interested ? (
            <FaHeart style={{ ...styles.wishlistIcon, fontSize: '15px' }} />
          ) : (
            <FaRegHeart style={{ ...styles.wishlistIcon, fontSize: '15px' }} />
          )}
          <span style={styles.wishlistLabel}>{interested ? "Interested" : "Interested?"}</span>
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
          <StarRatings
            rating={rating}
            starRatedColor="orange"
            changeRating={handleRatingChange}
            numberOfStars={5}
            name='rating'
            starDimension="25px" // Set the size of the stars
            starSpacing="2px" // Set the spacing between the stars
            disabled={rated} // Disable rating if the event has been rated
          />
        <textarea
          value={review}
          onChange={handleReviewChange}
          style={{ width: '50%', height: '5px', marginLeft: '50px', marginTop: '300px', margiBottom: '50px'}}></textarea>
          <div className="d-flex justify-content-end"> {/* Align items to the right */}
          <button onClick={handleSubmitReview} style={{ marginRight:'660px', marginBottom: '20px', marginTop: '00px' }}>Submit Review</button>
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
        </div>
      </div>
  );
}

export default AppEventDetail;
