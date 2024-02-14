import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaExternalLinkAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AppEventDetails() {
  const [activeEventData, setActiveEventData] = useState({});
=======
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
>>>>>>> 3569ff6cb646d91aa67d13b72edd42d10c98b5bd
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();
  const { attendee_id } = useParams();
  const { organiser_id } = useParams();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
<<<<<<< HEAD
  const [interested, setInterested] = useState(false);
  const [rated, setRated] = useState(false);
  const [eventWebsiteUrl, setEventWebsiteUrl] = useState("");

  const navigate = useNavigate();
=======
  const [interested, setInterested] = useState(false); // State variable to manage interest
  const [rated, setRated] = useState(false); // State variable to track if the event has been rated
  const [isAttendee, setIsAttendee] = useState(false); // State variable to track if the user is an attendee
  const [isOrganiser, setIsOrganiser] = useState(false); // State variable to track if the user is an organizer
>>>>>>> 3569ff6cb646d91aa67d13b72edd42d10c98b5bd

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/events/${event_id}/`)
      .then(response => {
<<<<<<< HEAD
        setActiveEventData(response.data);
        setLoading(false);
        setInterested(response.data.interested);
        setRated(response.data.rated);
        setEventWebsiteUrl(response.data.website_url);
=======
        setEventsData([response.data]);
        setLoading(false);
        setInterested(response.data.interested); // Update interested state from backend
        setRated(response.data.rated); // Update rated state from backend
        setIsAttendee(response.data.attendee === attendee_id); // Check if the logged-in user is the attendee
        setIsOrganiser(response.data.organiser === organiser_id); // Check if the logged-in user is the organizer
>>>>>>> 3569ff6cb646d91aa67d13b72edd42d10c98b5bd
      })
      .catch(error => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
<<<<<<< HEAD
  }, [event_id]);

  const handleRatingChange = (newRating) => {
    if (!rated) {
=======
  }, [event_id, attendee_id, organiser_id]);

  // Function to fetch organizer ID from event data (replace with your logic)
  // const getOrganizerId = () => {
  //   const eventData = eventsData[0];
  //   return eventData ? eventData.organizer : null;
  // };

  const eventWebsiteUrl = "https://www.google.com/";

  const activeEventData = eventsData[0] || {};

  const handleRatingChange = (newRating) => {
    const authToken = localStorage.getItem('Bearer'); // Replace with the actual key you used for storing the token

    if (!rated) { // Check if the event has been rated
>>>>>>> 3569ff6cb646d91aa67d13b72edd42d10c98b5bd
      setRating(newRating);
      const token = localStorage.getItem('token');
      const headers = {
<<<<<<< HEAD
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
=======
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
>>>>>>> 3569ff6cb646d91aa67d13b72edd42d10c98b5bd
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

<<<<<<< HEAD
  const handleSubmitReview = () => {
    const reviewData = {
      body: review
=======
  const handleSubmitReview = async () => {
    const authToken = localStorage.getItem('Bearer'); // Replace with the actual key you used for storing the token

    if (!authToken) {
      // Handle the case when the token is not available
      console.error('Authentication token not found in local storage');
      return;
    };
    const token = localStorage.getItem('token'); // Get the token from wherever you store it (e.g., localStorage)
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // Assuming you're sending JSON data
>>>>>>> 3569ff6cb646d91aa67d13b72edd42d10c98b5bd
    };
    try {
      const reviewData = { 
        body: review,
        attendee: attendee_id, // Replace with the actual ID of the attendee submitting the review
        event: event_id 
      };// Replace with the actual ID of the event for which the review is being submitted
      const response = await axios.post(`http://127.0.0.1:8000/reviews/`, reviewData);
      console.log("Review submitted successfully:", response.data);
      // Optionally, you can update UI or show a success message
    } catch (error) {
      console.error('Error submitting review:', error);
      // Handle error, show error message, etc.
    }
  }

<<<<<<< HEAD
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
=======
  const handleToggleInterest = async (e) => {
    const authToken = localStorage.getItem('Bearer'); // Replace with the actual key you used for storing the token

    if (!authToken) {
      // Handle the case when the token is not available
      console.error('Authentication token not found in local storage');
      return;
    }
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/events/${event_id}/interested/`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      console.log("Toggle interest response:", response.data);
      if (response.data.success) {
        setInterested(response.data.message === 'Added to Interested'); // Update interested state based on response
      } else {
        console.error('Error toggling interest:', response.data.error);
      }
    } catch (error) {
      console.error('Error toggling interest:', error);
    }
  };

  // CSS styles
  const Interestedstyles = {
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

  // CSS styles
  const Updatestyles = {
    updateButton: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    updateIcon: {
      color: "pink", // Color of the update icon
      fontSize: "20px", // Size of the update icon
      marginRight: "10px", // Spacing between the update icon and the label
    },
    updateLabel: {
      fontSize: "15px", // Size of the label
    },
  }

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
      <div className="col-md-12">
        {/* Image rendering code */}
      </div>
      <div className="mt-3">
        {isAttendee && ( // Check if the user is an attendee
          <button
            style={{
              ...Interestedstyles.wishlistButton,
              width: '140px', // Adjust the width as needed
              height: '40px', // Adjust the height as needed
              marginTop: '20px',
              marginBottom: '20px',
              marginLeft: '1350px'
            }}
            onClick={handleToggleInterest}
          >
            {interested ? (
              <FaHeart style={{ ...Interestedstyles.wishlistIcon, fontSize: '15px' }} />
            ) : (
              <FaRegHeart style={{ ...Interestedstyles.wishlistIcon, fontSize: '15px' }} />
            )}
            <span style={Interestedstyles.wishlistLabel}>{interested ? "Interested" : "Interested?"}</span>
          </button>
        )}

          <button
            style={{
              ...Updatestyles.updateButton,
              width: '100px', // Adjust the width as needed
              height: '40px', // Adjust the height as needed
              marginTop: '20px',
              marginBottom: '20px',
              marginLeft: '1350px'
            }}
            //onClick={handleUpdateEvent}
          >
            Update
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
>>>>>>> 3569ff6cb646d91aa67d13b72edd42d10c98b5bd
