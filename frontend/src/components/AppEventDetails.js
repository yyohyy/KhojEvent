import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import {
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaShoppingCart,
  FaPlus, FaMinus,
} from "react-icons/fa"; // Import icons from react-icons library

const data = [
  {
    image: require("../assets/images/img0.jpg"),
    caption: "The Tour",
    description: "What real concert feels like",
  },
  {
    image: require("../assets/images/img20.jpg"),
    caption: "The tour",
    description: "What real concert feels like",
  },
  {
    image: require("../assets/images/img-hero1.jpg"),
    caption: "The tour",
    description: "What real concert feels like",
  },
];

function AppEventDetail() {
  const [index, setIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const eventWebsiteUrl = "https://www.google.com/";
  const handleBooking = () => {
    // Perform booking logic here, such as making an API call or redirecting to a booking page
    console.log("Booking the event!");
  };
  return (
    <div>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        {data.map((slide, i) => {
          return (
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={slide.image}
                alt="slider image"
              />
              <Carousel.Caption>
                <h3>{slide.caption}</h3>
                <p>{slide.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
      </Carousel>
      <div className="container-fluid">
  <div className="row">
    <div className="col-md-9">
      <div className="card p-5">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="card-title">THE SWIFT TOUR ERA</h1>
              <p className="card-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                feugiat nunc vitae velit vestibulum, vel lacinia odio
                ultricies. Sed eu nisi nec justo tempor accumsan. In hac
                habitasse platea dictumst. Fusce euismod tincidunt massa, a
                fringilla dui aliquam at.
              </p>
              <div className="alert alert-info" role="alert">
                Special Offer: Pre-book your tickets now and get a 10%
                discount! Limited time only.
              </div>
              <div className="d-inline-flex p-2">
                <span className="me-3">
                  <FaCalendarAlt /> January 31, 2024
                </span>
                <span className="me-3">
                  <FaClock /> 7:00 PM
                </span>
                <span>
                  <FaMapMarkerAlt /> Event Location: City Hall Auditorium
                </span>
              </div>
              
              <span className="mt-20">
                <FaTicketAlt /> Ticket Categories:
              </span>
              <ul className="list-group mt-2">
                <li className="list-group-item">Front Row: $50</li>
                <li className="list-group-item">Middle Row: $30</li>
                <li className="list-group-item">Back Row: $20</li>
              </ul>
              <div className="booking-button">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleBooking}
                >
                  Book Now
                </button>
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
      </div>
    </div>
    <div className="col-md-3 mt-5">
      <div className="ticket-buying-container ad-container bg-light text-light p-3 rounded border border-dark">
        <p className="ad-text text-dark ">Limited Time Offer!</p>
        <div className="d-flex align-items-center">
          <p className="text-dark">Ticket quantity</p>
              {/* Minus button */}
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <FaMinus />
              </button>
              {/* Quantity display */}
              <span className="input-group-text mx-2">{quantity}</span>
              {/* Plus button */}
              <button
                type="button"
                className="btn btn-link"
                onClick={() => setQuantity(quantity + 1)}
              >
                <FaPlus />
              </button>
            </div>
        <button
          type="button"
          className="btn btn-success mt-2"
          onClick={handleBooking}
        >
          BUY TICKETS
        </button>
      </div>
    </div>
  </div>
</div>
</div>
);
}
export default AppEventDetail;