import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Route, Routes, BrowserRouter, useLocation } from 'react-router-dom'; // Import necessary components from react-router-dom
import AppHeader from './components/header';
import AppHero from './components/hero';
import AppEvents from './components/events';
import AppTestimonials from './components/testimonials';
import AppEventDetails from './components/AppEventDetails';
import AppContact from './components/contact';
import AppFooter from './components/footer';
import AppSignup from './components/signup';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import CreateEvent from './components/CreateEvent'; // Import the new page
import AppLogin from './components/login';
import Activate from './components/Activate'; 
import { Provider } from 'react-redux';
import store from './store';
import UserTypeSelection from './components/UserTypeSelection';
import AttendeeSignup from './components/AttendeeSignUp';
import OrganizerSignup from './components/OrganizerSignUp';
import ProfileDashboard from './components/Profile';
import BookingPage from './components/booking';
import Payment from './components/Payment';
import Order from './components/Order';
import InterestedEvents from './components/Interested';
import SearchResults from './components/SearchResults';
// import InterestedEvents from './components/Interested';
import BookedTickets from './components/booked';
import UpdateEvent from './components/UpdateEvents';
import Update from './components/update';
import PurchasedTickets from './components/Purchased';
import AttendedEvents from './components/AttendedEvents';
import Ratings from './components/Ratings';
import Reviews from './components/Reviews';
import Feedback from './components/Feedback';

function App() {
  return (
   <Provider store={store}>
      <div className="App" >
      <BrowserRouter basename='/'>
        <header id="header">
          <AppHeader />
        </header>
        <div className='content'>
            <Routes>
            <Route path="/" element={<AppHero />} />
          <Route path="/home" element={<AppHero />} />
          <Route path="/events" element={<AppEvents />} />
          <Route path="/testimonials" element={<AppTestimonials />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/contact" element={<AppContact />} />
          <Route path="/signup" element={<AppSignup />} />
          <Route path="/login" element={<AppLogin />} />
          <Route path="/user-type-selection" element={<UserTypeSelection />} />
          <Route path="/attendee-signup" element={<AttendeeSignup/>} />
          <Route path="/organizer-signup" element={<OrganizerSignup/>} />
          <Route path='/activate/:uid/:token' element={<Activate/>} />
          <Route path='/booking/:event_id' element={<BookingPage/>} />
          <Route path="profile/:id" element={<ProfileDashboard />} /> {/* Use '*' to match any route under /profile */}
          <Route path="/events/:event_id" element={<AppEventDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          <Route path="/orders/:orderId" element={<Order />} />
          <Route path="/search" element={<SearchResults/>} />
          <Route path="/profile/:id/interested" element={<InterestedEvents/>} />
          <Route path="/profile/:oganiser_id/events" element={<UpdateEvent/>} />
          <Route path="/profile/:organiser_id/events/update/:event_id" element={<Update />} />
          <Route path="/profile/:id/booked" element={<BookedTickets/>} />
          <Route path="/profile/:id/purchases" element={<PurchasedTickets/>} />
          <Route path="/profile/:id/attended-events" element={<AttendedEvents/>} />
          <Route path="/profile/:id/leave-feedback/:eventId" element={<Feedback/>} />
          <Route path="/profile/:id/ratings-left" element={<Ratings/>} />
          <Route path="/profile/:id/reviews-left" element={<Ratings/>} />
          </Routes>
         </div>
        </BrowserRouter>
          <footer id="footer">
          <AppFooter />
        </footer>
     </div>
     </Provider>
  );
}

export default App;
