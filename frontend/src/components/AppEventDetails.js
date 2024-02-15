import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaExternalLinkAlt, FaHeart, FaRegHeart,FaStar } from "react-icons/fa";
import { BiEnvelope, BiPhone, BiMap } from 'react-icons/bi';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('Bearer')}`,
  },
});

function AppEventDetails() {
  const [activeEventData, setActiveEventData] = useState({});
  const [organiserData, setOrganiserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();
  const [rating, setRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [interested, setInterested] = useState(false);
  const [rated, setRated] = useState(false);
  const [eventWebsiteUrl, setEventWebsiteUrl] = useState("");
  const [attendeeData, setAttendeeData] = useState([]);
  const [isOrganiser, setIsOrganiser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axiosInstance.get(`/events/${event_id}/`);
        setActiveEventData(eventResponse.data);
        setLoading(false);
        //setRated(eventResponse.data.rated);
        setEventWebsiteUrl(eventResponse.data.website_url);

        const ratingResponse = await axiosInstance.get(`/events/${event_id}/ratings`);
        setRating(ratingResponse.data.average_rating);

        const ratingsResponse = await axiosInstance.get(`/rated-events/${event_id}/`);
        setRatings(ratingsResponse.data.event_ratings);

        // Fetch reviews
       // const reviewsResponse = await axiosInstance.get(`/reviews/${event_id}/`);
        //setReviews(reviewsResponse.data);

        const userResponse = await axiosInstance.get(`/users/me/`);
        setIsOrganiser(userResponse.data.is_organiser);

        if (eventResponse.data.organiser) {
          const organiserId = eventResponse.data.organiser;
          const organiserResponse = await axiosInstance.get(`/users/details/${organiserId}/`);
          setOrganiserData(organiserResponse.data);
        }

        if (!userResponse.data.is_organiser) {
          const interestedResponse = await axiosInstance.get(`/interested-event/${event_id}/`);
          setInterested(interestedResponse.data.success);
        }

        const attendeeIds = [...new Set(ratingsResponse.data.event_ratings.map(rating => rating.attendee))];
        const attendeesData = await Promise.all(attendeeIds.map(async attendeeId => {
          const attendeeResponse = await axiosInstance.get(`/users/details/${attendeeId}/`);
          return attendeeResponse.data;
        }));
        setAttendeeData(attendeesData);

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [event_id]);

 
  // function findReviewByAttendee(attendeeId) {
  //   const review = reviews.find(review => review.attendee === attendeeId);
  //   return review ? review.comment : "No review available";
  // }
  const handleToggleInterest = async () => {
    try {
      const response = await axiosInstance.post(`/events/${event_id}/interested/`, {});
  
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

  const handleUpdate = () => {
    navigate(`/update-event/${event_id}`);
  };

  return (
    <section className="container py-5">
      <div className="row">
        <div className="col-md-12">
          {activeEventData.image && (
            <img
              className="d-block w-100"
              src={activeEventData.image}
              alt={`Event Image`}
            />
          )}
        </div>
        <div className="col-md-8 mx-auto">
          <div className="card p-5">
            {isOrganiser && activeEventData.organiser === parseInt(localStorage.getItem("id"), 10) ? (
              <div className="text-end mb-3">
                <button
                  className={`btn btn-primary btn-lg`}
                  onClick={handleUpdate}
                >
                  Update Event
                </button>
              </div>
            ) : (
              <div className="text-end mb-3">
                {!isOrganiser && (
                  <button
                    className={`btn btn-primary btn-lg`}
                    onClick={handleToggleInterest}
                  >
                    {interested ? (
                      <FaHeart className="me-2" />
                    ) : (
                      <FaRegHeart className="me-2" />
                    )}
                    {interested ? " Interested" : " Add to Interested"}
                  </button>
                )}
              </div>
            )}
<div className="card-title" style={{ fontFamily: "Comfortaa, cursive", color: "#f64b4b",fontSize: '50px', color: '#333', fontWeight: 'bold' }}><h1>{activeEventData.name}</h1></div>

            <div className="d-flex align-items-center mt-1 mb-2">
              <StarRatings
                rating={rating}
                starRatedColor="orange"
                //changeRating={handleRatingChange}
                numberOfStars={5}
                name='rating'
                starDimension="25px"
                starSpacing="2px"
                disabled={rated}
              />
            </div>
            <div className="d-flex align-items-center mt-3">
              <span className="me-3">
                <FaMapMarkerAlt /> {activeEventData.venue}
              </span>
              <span className="me-3">
                <FaClock /> {activeEventData.start_time}
              </span>
              <span>
                <FaCalendarAlt /> {activeEventData.start_date}
              </span>
            </div>
            <p className="card-text mt-3" style={{ textAlign: 'justify' }}>{activeEventData.description}</p>
            {!isOrganiser && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleBooking}
                >
                  Book Now
                </button>
              </div>
            )}
{organiserData && organiserData.organiser_details && (
  <div className="mt-5 shadow p-3 rounded mx-auto" style={{ width: '600px' }}>
  <div>
    <div className="d-flex align-items-center">
      <div className="me-3" style={{ flex: '0 0 auto' }}>
        <img src={organiserData.profile_picture} className="rounded-circle" alt="Organiser Profile" style={{ width: '200px', height: '200px' }} />
      </div>
      <div style={{ flex: '1', paddingLeft: '20px' }}>
      <h4>Brought to you by:</h4>
        <p style={{ fontFamily: "Comfortaa, cursive", color: "#f64b4b", fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>{organiserData.organiser_details.name}</p>
        <div className="mt-3">
          <span className="me-2"><BiPhone style={{ color: 'red' }} /></span>
          <span>{organiserData.phone_number}</span>
        </div>
        <div>
          <span className="me-2"><BiEnvelope style={{ color: 'red' }} /></span>
          <span>{organiserData.email}</span>
        </div>
        <div className="me-2">
          <span className="me-2"><BiMap style={{ color: 'red' }} /></span>
          <span>{organiserData.organiser_details.address}</span>
        </div>
      </div>
    </div>
  </div>
</div>



)}

<div style={{ paddingTop: '20px' }}>
  <h2 style={{ marginBottom: '30px',marginTop: '50px' }}>Ratings and Reviews:</h2>
  {ratings.length > 0 ? (
    ratings.map((rating, index) => (
      <div key={index} style={{ marginBottom: '10px' }}>
        <div className="d-flex align-items-center">
          <div>
            <StarRatings
              rating={rating.stars}
              starRatedColor="orange"
              starDimension="20px"
              starSpacing="2px"
              numberOfStars={5}
            />
          </div>
          <div className="ms-2" style={{ paddingLeft: '10px', marginTop: '5px' }}>
            {attendeeData && attendeeData.length > 0 && attendeeData[index] && (
              <p style={{ margin: '0', color: 'gray' }}>{`${attendeeData[index].attendee_details.first_name} ${attendeeData[index].attendee_details.last_name}`}</p>
            )}
          </div>
        </div>
        {index !== ratings.length - 1 && <hr />}
      </div>
    ))
  ) : (
    <p>No ratings available.</p>
  )}
</div>
          </div>
        </div>
      </div>
    </section>

  );
}

function renderStars(stars) {
  const starIcons = [];

  for (let i = 0; i < stars; i++) {
    starIcons.push(<FaStar key={i} />);
  }

  return starIcons;
}


export default AppEventDetails;



  // const handleRatingChange = (newRating) => {
  //   if (!rated) {
  //     setRating(newRating);
  //     const eventData = {
  //       rating: newRating,
  //       event_id: event_id,
  //       stars: newRating,
  //     };

  //     axiosInstance.post(`/rate/`, eventData)
  //       .then(response => {
  //         console.log("Rating added successfully:", response.data);
  //         setRated(true);
  //       })
  //       .catch(error => {
  //         console.error('Error adding rating:', error);
  //       });
  //   }
  // };


// const handleReviewChange = (e) => {
//   setReview(e.target.value);
// }

// const handleSubmitReview = async () => {
//   const reviewData = {
//     body: review,
//     attendee: attendee_id,
//     event: event_id 
//   };

//   try {
//     const token = localStorage.getItem('Bearer');
//     const headers = {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     };
    
//     const response = await axios.post(`http://127.0.0.1:8000/reviews/`, reviewData, { headers });
//     console.log("Review submitted successfully:", response.data);
//   } catch (error) {
//     console.error('Error submitting review:', error);
//   }
// }

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
