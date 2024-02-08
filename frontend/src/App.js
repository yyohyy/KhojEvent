// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';
// import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'; // Import necessary components from react-router-dom

// import AppHeader from './components/header';
// import AppHero from './components/hero';
// import AppAbout from './components/about';
// // import AppServices from './components/services';
// import AppWorks from './components/works';
// // import AppTeams from './components/teams';
// import AppTestimonials from './components/testimonials';
// // import AppPricing from './components/pricing';
// import AppBlog from './components/blog';
// import AppContact from './components/contact';
// import AppFooter from './components/footer';
// import CreateEvent from './components/CreateEvent'; 
// function App() {
//   return (
//     <div className="App">
//       <header id='header'>
//         <AppHeader />
//       </header>
//       <main>
//         <AppHero />
//         <AppAbout />
//         {/* <AppServices /> */}
//         <AppWorks />
//         {/* <AppTeams /> */}
//         <AppTestimonials />
//         {/* <AppPricing /> */}
//         <AppBlog />
//         <AppContact />
//         <CreateEvent />
//       </main>
//       <footer id="footer">
//         <AppFooter />
//       </footer>
//     </div>
//   );
// }

// export default App;
// App.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Router, Route, Link, Routes, BrowserRouter } from 'react-router-dom'; // Import necessary components from react-router-dom
import axios from 'axios';
import AppHeader from './components/header';
import AppHero from './components/hero';
import AppEvents from './components/events';
import AppTestimonials from './components/testimonials';
import AppEventDetails from './components/AppEventDetails';
import AppContact from './components/contact';
import AppFooter from './components/footer';
import AppSignup from './components/signup';
import CreateEvent from './components/CreateEvent'; // Import the new page
import AppLogin from './components/login';
import Activate from './components/Activate'; 
import { Provider } from 'react-redux';
import store from './store';
import UserTypeSelection from './components/UserTypeSelection';
import AttendeeSignup from './components/AttendeeSignUp';
import OrganizerSignup from './components/OrganizerSignUp';
import Profile from './components/Profile';
function App() {
  return (
   <Provider store={store}>
      <div className="App">
        <header id="header">
          <AppHeader />
        </header>
        <div className='content'>
          <BrowserRouter basename='/'>
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
              <Route path="/profile" element={<Profile/>} />
              <Route path="/events/:event_id" element={<AppEventDetails />} />
            </Routes>
          </BrowserRouter>
        </div>
          <footer id="footer">
          <AppFooter />
        </footer>
    
    
  
     </div>
     </Provider>
  );
}

export default App;
