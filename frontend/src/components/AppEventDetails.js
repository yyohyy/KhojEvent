import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
} from "react-icons/fa";
import axios from 'axios';
import { useParams } from 'react-router-dom';  // Import useParams from react-router-dom

function AppEventDetail() {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { event_id } = useParams();  // Get the event ID from the URL parameter
  console.log(event_id);
  useEffect(() => {
    // Fetch specific event data from Django backend API
    axios.get(`http://127.0.0.1:8000/events/${event_id}/`)
      .then(response => {
        setEventsData([response.data]);  // Wrap the data in an array
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching event data:', error);
        setLoading(false);
      });
  }, [event_id]); // Re-run the effect when the eventId changes

  const eventWebsiteUrl = "https://www.google.com/";

  const activeEventData = eventsData[0] || {};  // Use the first (and only) element in the array

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
         <div className="col-md-100">
        <div className="card p-5">
          <div className="card-body">
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
            {/* Additional details */}
            {/* <div className="booking-button">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleBooking}
              >
                Book Now
              </button>
            </div> */}
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
    </div>
  );
}

export default AppEventDetail;


// import React, { useState } from "react";
// import Carousel from "react-bootstrap/Carousel";
// import {
//   FaCalendarAlt,
//   FaClock,
//   FaTicketAlt,
//   FaMapMarkerAlt,
//   FaExternalLinkAlt,
// } from "react-icons/fa"; // Import icons from react-icons library

// const data = [
//   {
//     image: require("../assets/images/img0.jpg"),
//     caption: "The Tour",
//     description: "What real concert feels like",
//   },
//   {
//     image: require("../assets/images/img20.jpg"),
//     caption: "The tour",
//     description: "What real concert feels like",
//   },
//   {
//     image: require("../assets/images/img-hero1.jpg"),
//     caption: "The tour",
//     description:  "What real concert feels like",
    
//   },
// ];

// function AppEventDetail() {
//   const [index, setIndex] = useState(0);
//   const handleSelect = (selectedIndex, e) => {
//     setIndex(selectedIndex);
    
//   };
//   const eventWebsiteUrl = "https://www.google.com/";
//   const handleBooking = () => {
//     // Perform booking logic here, such as making an API call or redirecting to a booking page
//     console.log("Booking the event!");
//   }
//   return (
//     <div>
//       <Carousel activeIndex={index} onSelect={handleSelect}>
//         {data.map((slide, i) => {
//           return (
//             <Carousel.Item>
//               <img
//                 className="d-block w-100"
//                 src={slide.image}
//                 alt="slider image"
//               />
//               <Carousel.Caption>
//                 <h3>{slide.caption}</h3>
//                 <p>{slide.description}</p>
//               </Carousel.Caption>
//             </Carousel.Item>
//           );
//         })}
//       </Carousel>
//       <div className="col-md-100">
//         <div className="card p-5">
//           <div className="card-body">
//             <h1 className="card-title">THE SWIFT TOUR ERA</h1>
//             <p className="card-text">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
//               feugiat nunc vitae velit vestibulum, vel lacinia odio ultricies.
//               Sed eu nisi nec justo tempor accumsan. In hac habitasse platea
//               dictumst. Fusce euismod tincidunt massa, a fringilla dui aliquam
//               at.
//             </p>
//             <div className="d-flex align-items-center mt-3">
//               <span className="me-3">
//                 <FaCalendarAlt /> January 31, 2024
//               </span>
//               <span className="me-3">
//                 <FaClock /> 7:00 PM
//               </span>
//               <span>
//                 <FaMapMarkerAlt /> Event Location: City Hall Auditorium
//               </span>
//             </div>
//             <div className="alert alert-info" role="alert">
//               Special Offer: Pre-book your tickets now and get a 10% discount!
//               Limited time only.
//             </div>
//             <span className="mt-20">
//               <FaTicketAlt /> Ticket Categories:
//             </span>
//             <ul className="list-group mt-2">
//               <li className="list-group-item">Front Row: $50</li>
//               <li className="list-group-item">Middle Row: $30</li>
//               <li className="list-group-item">Back Row: $20</li>
//             </ul>
//             <div className="booking-button">
//               <button
//                 type="button"
//                 className=" btn-success"
//                 onClick={handleBooking}
//               >                Book Now
//               </button>
//             </div>
//             <span className="mt-5">
//               <FaExternalLinkAlt />{" "}
//               <a
//                 href={eventWebsiteUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 For more details, visit the event website
//               </a>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default AppEventDetail;