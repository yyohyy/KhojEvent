import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaExternalLinkAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AppEventDetails() {
  const [activeEventData, setActiveEventData] = useState({});
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [interested, setInterested] = useState(false);
  const [rated, setRated] = useState(false);
  const [eventWebsiteUrl, setEventWebsiteUrl] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/events/${event_id}/`)
      .then(response => {
        setActiveEventData(response.data);
        setLoading(false);
        setInterested(response.data.interested);
        setRated(response.data.rated);
        setEventWebsiteUrl(response.data.website_url);
      })
      .catch(error => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
  }, [event_id]);

  const handleRatingChange = (newRating) => {
    if (!rated) {
      setRating(newRating);
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      const eventData = {
        rating: newRating,
        event_id: event_id,
        stars: newRating,
      };
  
      axios.post(`http://127.0.0.1:8000/rate/`, eventData, { headers })
        .then(response => {
          console.log("Rating added successfully:", response.data);
          setRated(true);
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
    const reviewData = {
      body: review
    };

    axios.post(`http://127.0.0.1:8000/review-event/${event_id}/`, reviewData)
      .then(response => {
        console.log("Review submitted successfully:", response.data);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
      });
  }

  const handleToggleInterest = async () => {
    try {
      // Retrieve the authentication token from local storage
      const authToken = localStorage.getItem('Bearer'); // Replace 'token' with the actual key you used for storing the token
  
      if (!authToken) {
        // Handle the case when the token is not available
        console.error('Authentication token not found in local storage');
        return;
      }
  
      // Make API call with the obtained token
      const response = await axios.post(`http://127.0.0.1:8000/events/${event_id}/interested/`, {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.success) {
        setInterested(prevInterested => !prevInterested);
      } else {
        console.error('Error toggling interest:', response.data.error);
      }
    } catch (error) {
      console.error('Error toggling interest:', error);
    }
  };
  

  const handleBooking = () => {
    navigate(`/booking/${event_id}`);
  };
  return (
    <section className="container mx-auto py-10">
      <div className="row">
        {/* Image */}
        <div className="col-md-12">
          {activeEventData.image && ( // Check if the image field is not null
            <img
              className="d-block w-100"
              src={activeEventData.image} // Assuming "image" is the field containing the image URL
              alt={`Event Image`}
            />
          )}
        </div>
        
        {/* Event Details */}
        <div className="col-md-8 mb-4 mx-auto">
          <div className="card p-5">
            {/* Interested Button */}
            <div className="text-end mb-3">
            <button
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          onClick={handleToggleInterest}
        >
          {interested ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart />
          )}
          <span>{interested ? " Interested" : " Add to Interested"}</span>
        </button>
            </div>
            {/* Name */}
            <h1 className="card-title">{activeEventData.name}</h1>
            {/* Stars */}
            <div className="d-flex align-items-center mt-3">
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
            </div>
            {/* Venue, Time, Date */}
            <div className="d-flex align-items-center mt-3">
              <span className="me-3">
                <FaMapMarkerAlt /> Event Location: {activeEventData.venue}
              </span>
              <span className="me-3">
                <FaClock /> {activeEventData.start_time}
              </span>
              <span>
                <FaCalendarAlt /> {activeEventData.start_date}
              </span>
            </div>
            {/* Description */}
            <p className="card-text mt-3">{activeEventData.description}</p>
            {/* Book Button */}
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
    </section>
  );
                }  
export default AppEventDetails;





    {/* <div className="col-md-6 d-flex align-items-center justify-content-end">
      <button
        style={{
          ...styles.wishlistButton,
          width: '140px',
          height: '40px',
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
    </div> */}
// <textarea
// value={review}
// onChange={handleReviewChange}
// className="w-full h-24 mt-4 px-3 py-2 border border-gray-300 rounded-md"
// placeholder="Write your review here..."
// ></textarea>
// <div className="flex justify-end mt-4">
// <button
//   className="px-4 py-2 bg-blue-500 text-white rounded-md"
//   onClick={handleSubmitReview}
// >
//   Submit Review
// </button>
// </div>
// <div className="mt-5">
// <FaExternalLinkAlt className="mr-2" />
// <a
//   href={eventWebsiteUrl}
//   target="_blank"
//   rel="noopener noreferrer"
//   className="text-blue-500 hover:underline"
// >
//   For more details, visit the event website
// </a>
// </div>