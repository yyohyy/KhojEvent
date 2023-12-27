import React from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Events from './components/Events';
import About from './components/About';
import CreateEvent from './components/CreateEvent';
import Signup from './components/Signup';
import Navbar from './components/Navbar/Navbar';
// import CreateEvent from './components/CreateEvent';
const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/events" element={<Events/>}/> 
        <Route path="/createevent" element={<CreateEvent/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/signup" element={<Signup/>}/>
    </Routes>
    </BrowserRouter>
  )
};

export default App;