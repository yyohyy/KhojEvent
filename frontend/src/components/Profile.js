import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileDashboard = () => {
  const [userData, setUserData] = useState("jessica dangol 2001"); // Changed initial state to null
  const [editing, setEditing] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
 
  const UserProfile = () => {
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          // Fetch user ID first
          const userIdResponse = await axios.get('/api/get_user_id');
          const fetchedUserId = userIdResponse.data.user_id;
          setUserId(fetchedUserId);
  
          // Once we have the user ID, fetch user data using that ID
          const userDataResponse = await axios.get(`http://127.0.0.1:8000/details/${fetchedUserId}/`);
          setUserData(userDataResponse.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchUserData();
    }, []);
  
  //   return (
  //     <div>
  //       {userData ? (
  //         <div>
  //           <p>User ID: {userId}</p>
  //           <p>User Data
  
  // // useEffect(() => {
  //   // Fetch user data from the server
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get('http://127.0.0.1:8000/details/<int:pk>/');
  //       setUserData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);
  }
  const handleEdit = () => {
    setEditing(true);
    // Initialize the input fields with current user data
    setNewFirstName(userData.first_name);
    setNewLastName(userData.last_name);
    setNewBirthDate(userData.birth_ate);
  };

  const handleSave = async () => {
    try {
      // Make an API call to update user data
      const response = await axios.put('http://127.0.0.1:8000/details/<int:pk>/', {
        firstName: newFirstName,
        lastName: newLastName,
        birthDate: newBirthDate,
      });
      // Update userData state with the updated data
      setUserData(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    // Reset input fields to current user data
    setNewFirstName(userData.first_name);
    setNewLastName(userData.last_name);
    setNewBirthDate(userData.birth_date);
    setEditing(false);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
    <div className="row">
      {/* Left Sidebar with options */}
      <div className="col-md-3">
        <div className="list-group">
          <button className="list-group-item list-group-item-action" onClick={() => console.log("View Liked Events")}>View Liked Events</button>
          <button className="list-group-item list-group-item-action" onClick={() => console.log("Booked Events")}>Booked Events</button>
          <button className="list-group-item list-group-item-action" onClick={() => console.log("Paid Events")}>Paid Events</button>
          {/* Add more options/buttons as needed */}
        </div>
      </div>

      {/* Main Content */}
      <div className="col-md-9">
        <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '70px' ,backgroundColor: '#f0f0f0',width: '800px', height: '300px',borderRadius: '10px' 
      }}>
          <h2 className="mt-4 mb-3">Profile Personal:</h2>
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">First Name:</label>
            <div className="col-sm-10">{userData.first_name}</div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">Last Name:</label>
            <div className="col-sm-10">{userData.last_name}</div>
          </div>
          <div className="row mb-3">
            <label className="col-sm-2 col-form-label">Birth Date:</label>
            <div className="col-sm-10">{userData.birth_date}</div>
          </div>
          
          {!editing ? (
            <div>
            <p style={{ display: 'inline' }}>Do you want to edit?</p>
            <button className="btn btn-link" onClick={handleEdit}>Edit</button>
            </div>
          ) : (
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
              <div className="col">
                <input
                  type="date"
                  className="form-control"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                />
              </div>
              <div className="col">
                <button className="btn btn-secondary btn-sm" onClick={handleSave} style={{ marginRight: '5px' }}>Save</button>
                <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button> {/* Cancel Button */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

export default ProfileDashboard;
