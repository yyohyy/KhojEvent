import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './ProfileSidebar.css';
import axios from 'axios';

function ProfileSidebar() {
  const [isOrganiser, setIsOrganiser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/users/me/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Bearer')}`, // Example of sending an Authorization header
            // Add other headers as needed
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
        {/* Conditionally render buttons based on user type */}
        {isOrganiser ? (
          <>
          <button className="list-group-item list-group-item-action" onClick={() => navigate(``)}>Profile</button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate(`events`)}>Events</button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate(`create-event`)}>Create Event </button>
          </>
        ) : (
          <>
          <button className="list-group-item list-group-item-action" onClick={() => navigate(``)}>My Profile</button>
          <button className="list-group-item list-group-item-action" onClick={() => navigate('interested')}>Interested Events</button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate('booked')}>Booked Tickets</button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate(`purchases`)}>Events</button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate(`ratings-left`)}>Events You've Rated</button>
            <button className="list-group-item list-group-item-action" onClick={() => navigate(`reviews-left`)}>Events You've Reviewed</button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileSidebar;
