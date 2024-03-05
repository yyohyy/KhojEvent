import React, { useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaExternalLinkAlt, FaHeart, FaRegHeart,FaStar } from "react-icons/fa";
import { BiEnvelope, BiPhone, BiMap } from 'react-icons/bi';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// const axiosInstance = axios.create({
//   baseURL: 'http://127.0.0.1:8000',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${localStorage.getItem('Bearer')}`,
//   },
// });

function AppEventDetails() {
  const [activeEventData, setActiveEventData] = useState({});
  const [organiserData, setOrganiserData] = useState({});
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();
  const [rating, setRating] = useState(0);
  const [ratingsAndReviewsData, setRatingsAndReviewsData] = useState([]);
  const [interested, setInterested] = useState(false);
  const [rated, setRated] = useState(false);
  const [isOrganiser, setIsOrganiser] = useState(false);
  const [isAttendee, setIsAttendee] = useState(false);
  const navigate = useNavigate();
  const currentDate = new Date();
  const startDate = new Date(activeEventData.start_date);
  const isDisabled = currentDate >= startDate;
  console.log(currentDate)
  
  console.log(startDate)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get(`http://127.0.0.1:8000/events/${event_id}/`);
        setActiveEventData(eventResponse.data);
        setLoading(false);
        

        if (eventResponse.data.organiser) {
          const organiserId = eventResponse.data.organiser;
          const organiserResponse = await axios.get(`http://127.0.0.1:8000/users/details/${organiserId}/`);
          setOrganiserData(organiserResponse.data);
        }


        const ratingResponse = await axios.get(`http://127.0.0.1:8000/events/${event_id}/ratings`);
        setRating(ratingResponse.data.average_rating);
        console.log(rating)

        const fetchRatingsAndReviews = async () => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/events/${event_id}/ratings-and-reviews/`);
            setRatingsAndReviewsData(response.data);
          } catch (error) {
            console.error('Error fetching ratings and reviews:', error);
          }
        };
    
        fetchRatingsAndReviews();
        const userResponse = await axios.get(`http://127.0.0.1:8000/users/me/`,{
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('Bearer')}`,
          }});
        setIsOrganiser(userResponse.data.is_organiser);
        setIsAttendee(userResponse.data.is_attendee);
        console.log('isOrganiser:', userResponse.data.is_organiser);
        console.log('isAttendee:', userResponse.data.is_attendee);

        if (userResponse.data.is_attendee) {
          const interestedResponse = await axios.get(`http://127.0.0.1:8000/interested-event/${event_id}/`,{
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('Bearer')}`,
            }});
          setInterested(interestedResponse.data.success);
          console.log(interested)
          }
        



         const user=localStorage.getItem("id")
         console.log(user)
         console.log(eventResponse.data.organiser)
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [event_id]);



  const handleToggleInterest = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/events/${event_id}/interested/`, {},{
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('Bearer')}`,
        }});
  
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
    navigate(`/profile/${localStorage.getItem("id")}/events/update/${event_id}`);
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
            {isOrganiser && parseInt(activeEventData.organiser) === parseInt(localStorage.getItem("id")) ? (
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
                {isAttendee && (
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
            {!isOrganiser && isAttendee && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleBooking}
                  disabled={isDisabled}
                >
                  Book Now
                </button>
              </div>
            )}{organiserData && organiserData.organiser_details && (
              <div className="mt-5 shadow p-3 rounded mx-auto" style={{ maxWidth: '600px' }}>
                <div>
                  <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                    <div className="me-lg-3 mb-3 mb-lg-0" style={{ flex: '0 0 auto' }}>
                      <img src={organiserData.profile_picture} className="rounded-circle" alt="Organiser Profile" style={{ width: '200px', height: '200px' }} />
                    </div>
                    <div style={{ flex: '1', paddingLeft: '20px' }}>
                      <h4>Know The Organiser:</h4>
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
                        <span>{organiserData.organiser_details.area}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
<div style={{ paddingTop: '20px' }}>
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
        </div>
      </div>
    </section>

  );
}

export default AppEventDetails;