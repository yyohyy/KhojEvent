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
import ProfileSidebar from './components/ProfileSidebar';
import ProfileDashboard from './components/Profile';
import BookingPage from './components/booking';
import Payment from './components/Payment';
import Order from './components/Order';
import InterestedEvents from './components/Interested';
import SearchResults from './components/SearchResults';
import PurchasedTickets from './components/purchases';

function SidebarRoutes() {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    // Check if the current path starts with '/profile'
    setShowSidebar(location.pathname.startsWith('/profile'));
  }, [location.pathname]);

  return (
    <div className="App">
      <header id="header">
        <AppHeader />
      </header>
      <div className="row">
        <div className="col-md-2">
          {showSidebar && <ProfileSidebar />}
        </div>
        {/* <div className="col-md-10"> */}
        <div className={showSidebar ? 'col-md-10' : 'col-md-12'}>
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
            <Route path='/booking/:event_id' element={<BookingPage/>} />
            <Route path="/profile/*" element={<ProfileDashboard />} /> {/* Use '*' to match any route under /profile */}
            <Route path="/interested" element={<InterestedEvents />} />
            {/* <Route path="/purchases" element={<PurchasedTickets />} /> */}
            <Route path="/profile/:id/interested" element={<InterestedEvents/>} />
            <Route path="/profile/:id/purchases" element={<PurchasedTickets/>} />
            <Route path="/events/:event_id" element={<AppEventDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/:orderId" element={<Payment />} />
            <Route path="/orders/:orderId" element={<Order />} />
            <Route path="/search" element={<SearchResults/>} />
          </Routes>
        </div>
      </div>
      <footer id="footer">
        <AppFooter />
      </footer>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename='/'>
        <SidebarRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
