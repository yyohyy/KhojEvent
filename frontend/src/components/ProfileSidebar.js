// ProfileSidebar.js
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap'; // Import Button from react-bootstrap
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './ProfileSidebar.css'; // Import custom CSS file

function ProfileSidebar() {
  const [isOrganiser, setIsOrganiser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/me/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Bearer')}`,
          },
        });
        const { is_organiser } = response.data;
        setIsOrganiser(is_organiser);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, []);

  return (
    <div className="profile-sidebar">
      <div className="list-group">
        {isOrganiser ? (
          <>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/profile/${localStorage.getItem('id')}`)}>Profile</Button>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/profile/${localStorage.getItem('id')}/events`)}>Events</Button>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/create-event`)}>Create Event</Button>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/profile/${localStorage.getItem('id')}/trending`)}>Performance Analytics</Button> 
          </>
        ) : (
          <>
            <Button className="sidebar-btn" variant="light" onClick={() => navigate(`/profile/${localStorage.getItem('id')}`)}>My Profile</Button>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/profile/${localStorage.getItem('id')}/interested`)}>Interested Events</Button>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/profile/${localStorage.getItem('id')}/attended-events`)}>Attended Events</Button>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/profile/${localStorage.getItem('id')}/booked`)}>Booked Tickets</Button>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/profile/${localStorage.getItem('id')}/purchases`)}>Purchased Tickets</Button>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/profile/${localStorage.getItem('id')}/ratings-left`)}>Events You've Rated</Button>
            <Button className="sidebar-btn" variant="secondary" onClick={() => navigate(`/profile/${localStorage.getItem('id')}/reviews-left`)}>Events You've Reviewed</Button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileSidebar;
