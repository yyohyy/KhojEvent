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
import { Router, Route, Link, Routes, BrowserRouter, Switch } from 'react-router-dom'; // Import necessary components from react-router-dom

import AppHeader from './components/header';
import AppHero from './components/hero';
import AppAbout from './components/about';
import AppWorks from './components/works';
import AppTestimonials from './components/testimonials';
import AppEventDetails from './components/AppEventDetails';
import AppBlog from './components/blog';
import AppContact from './components/contact';
import AppFooter from './components/footer';
import CreateEvent from './components/CreateEvent'; // Import the new page

function App() {
  return (
   
      <div className="App">
        <header id="header">
          <AppHeader />
        </header>
        <div className='content'>
          <BrowserRouter basename='/'>
            <Routes>
              <Route path="/" element={<AppHero />} />
              <Route path="/home" element={<AppHero />} />
              <Route path="/works" element={<AppWorks />} />
              <Route path="/testimonials" element={<AppTestimonials />} />
              <Route path="/blog" element={<AppBlog />} />
              <Route path="/services" element={<CreateEvent />} />
              <Route path="/contact" element={<AppContact />} />
              <Route path="/about" element={<AppAbout />} />
              <Route path="/works/:id" element={<AppEventDetails />} />
            </Routes>
          </BrowserRouter>
        </div>
          <footer id="footer">
          <AppFooter />
        </footer>
    
    
  
     </div>
  );
}

export default App;
