import React from 'react';


const BookingPage = () => {
  

  // Handle the form submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // Perform your booking logic here (e.g., make an API call)

    // After successful booking, navigate to a confirmation page or any other page
    //history.push('/confirmation');
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Booking Event</h1>
      <form onSubmit={handleBookingSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" className="form-control" id="fullName" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" className="form-control" id="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="ticketType">Ticket Type</label>
          <select className="form-control" id="ticketType" required>
            <option value="frontRow">Front Row</option>
            <option value="middleRow">Middle Row</option>
            <option value="backRow">Back Row</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input type="number" className="form-control" id="quantity" min="1" required />
        </div>
        <div className="form-group">
          <label htmlFor="creditCard">Credit Card Number</label>
          <input type="text" className="form-control" id="creditCard" required />
        </div>
        <div className="form-group">
          <label htmlFor="expirationDate">Expiration Date</label>
          <input type="text" className="form-control" id="expirationDate" placeholder="MM/YYYY" required />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input type="text" className="form-control" id="cvv" required />
        </div>
        <button type="submit" className="btn btn-primary">Book Now</button>
      </form>
    </div>
  );
};

export default BookingPage;
