import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Route, Routes, BrowserRouter } from 'react-router-dom'; // Import necessary components from react-router-dom
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
import SearchResults from './components/SearchResults';

function App() {
  return (
   <Provider store={store}>
      <BrowserRouter basename='/'>
      <div className="App">
        <header id="header">
        <AppHeader />
        </header>
        <div className='content'>
            <Routes>
              <Route path="/" element={<AppHero />} />
              <Route path="/home" element={<AppHero />} />
              <Route path="/events" element={<AppEvents />} />
              <Route path="/testimonials" element={<AppTestimonials />} />
              <Route path="/services" element={<CreateEvent />} />
              <Route path="/contact" element={<AppContact />} />
              <Route path="/signup" element={<AppSignup />} />
              <Route path="/login" element={<AppLogin />} />
              <Route path="/user-type-selection" element={<UserTypeSelection />} />
              <Route path="/attendee-signup" element={<AttendeeSignup/>} />
              <Route path="/organizer-signup" element={<OrganizerSignup/>} />
              <Route path='/activate/:uid/:token' element={<Activate/>} />
              <Route path='/booking' element={<BookingPage/>} />
              <Route path='/booking/:event_id' element={<BookingPage/>} />
              <Route path="/profile" element={<ProfileDashboard />} />
              <Route path="/profile/:profile_id" element={<ProfileDashboard/>} />
              <Route path="/events/:event_id" element={<AppEventDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment/:orderId" element={<Payment />} />
              <Route path="/orders/:orderId" element={<Order />} />
              <Route path="/search" element={<SearchResults/>} />
            </Routes>
        </div>
        <footer id="footer">
        <AppFooter />
        </footer>
      </div>
     </BrowserRouter>
     </Provider>
  );
}

export default App;
