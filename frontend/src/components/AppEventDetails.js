// App.js

import React from 'react';
import './AppEventDetail.css';
import concertImage from './concert.jpg'; // Replace with the actual path to your concert image

function AppEventDetail() {
  const ticketOptions = [
    { type: 'General Admission', price: 35 },
    { type: 'VIP Experience', price: 75 },
    { type: 'Front Row Package', price: 120 },
  ];

  return (
    <div className="App">
      <div id="eventDetails">
        <div className="header">
          <img src={concertImage} alt="Concert" className="concertImage" />
          <div className="eventInfo">
            <h2>Summer Jam 2024</h2>
            <p className="subInfo"><strong>Date:</strong> July 20, 2024</p>
            <p className="subInfo"><strong>Time:</strong> 7:00 PM - 11:00 PM</p>
            <p className="subInfo"><strong>Location:</strong> Sunset Park Amphitheater, Cityville, CA</p>
          </div>
        </div>
        <div className="description">
          <h3>Description</h3>
          <p>
            Join us for an unforgettable night of music, fun, and memories at the Summer Jam 2024 concert! Immerse yourself in a musical journey featuring top artists from various genres, promising an eclectic mix of sounds that will keep you dancing all night long. This is an event you won't want to miss, so grab your friends and family, and get ready for a summer night filled with incredible performances.
          </p>
        </div>
        <div className="ticketInfo">
          <h3>Ticket Prices</h3>
          <div className="ticketDropdown">
            <label htmlFor="ticketType">Select Ticket Type:</label>
            <select id="ticketType">
              {ticketOptions.map((option, index) => (
                <option key={index}>{option.type}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="ticketDetails">
          <h3>Ticket Details</h3>
          <p>
            Choose your ticket type from the dropdown above and proceed to purchase. Limited tickets are available, so secure yours early to guarantee your spot at the Summer Jam 2024!
          </p>
        </div>
        <div className="purchaseInfo">
          <h3>How to Purchase Tickets</h3>
          <p>
            Tickets can be purchased online at <a href="https://www.summerjam2024.com" target="_blank" rel="noopener noreferrer">www.summerjam2024.com</a> or at the Sunset Park Amphitheater box office.
          </p>
          <p className="note">
            <strong>Note:</strong> Limited tickets available, so secure yours early to guarantee your spot at the Summer Jam 2024!
          </p>
        </div>
        <div className="actionButton">
          <button className="purchaseButton" style={{ backgroundColor: '#f64b4b' }}>Purchase Tickets</button>
        </div>
      </div>
    </div>
  );
}

export default AppEventDetail;
