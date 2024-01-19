import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import {
  FaCalendarAlt,
  FaClock,
  FaTicketAlt,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
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
    description:  "What real concert feels like",
    
  },
];

function AppEventDetail() {
  const [index, setIndex] = useState(0);
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };
  const eventWebsiteUrl = "https://www.google.com/";
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
      <div className="col-md-100">
        <div className="card p-5">
          <div className="card-body">
            <h1 className="card-title">THE SWIFT TOUR ERA</h1>
            <p className="card-text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
              feugiat nunc vitae velit vestibulum, vel lacinia odio ultricies.
              Sed eu nisi nec justo tempor accumsan. In hac habitasse platea
              dictumst. Fusce euismod tincidunt massa, a fringilla dui aliquam
              at.
            </p>
            <div className="d-flex align-items-center mt-3">
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
            <div className="alert alert-info" role="alert">
              Special Offer: Pre-book your tickets now and get a 10% discount!
              Limited time only.
            </div>
            <span className="mt-20">
              <FaTicketAlt /> Ticket Categories:
            </span>
            <ul className="list-group mt-2">
              <li className="list-group-item">Front Row: $50</li>
              <li className="list-group-item">Middle Row: $30</li>
              <li className="list-group-item">Back Row: $20</li>
            </ul>
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
