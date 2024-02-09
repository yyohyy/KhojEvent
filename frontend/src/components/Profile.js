import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newBirthDate, setNewBirthDate] = useState('');
  const { id } = useParams(); // Get the profile ID from the URL parameter
// console.log(id);
  useEffect(() => {
    // Fetch user data from the server using the profile ID
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/users/details/${localStorage.getItem("id")}/`);
        console.log(response);
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]); // Re-run the effect when the profileId changes

  const handleEdit = () => {
    setEditing(true);
    // Initialize the input fields with current user data
    setNewFirstName(userData.first_name);
    setNewLastName(userData.last_name);
    setNewBirthDate(userData.birth_date);
  };

  const handleSave = async () => {
    try {
      const authToken = localStorage.getItem('Bearer');
      // Make an API call to update user data
      const response = await axios.patch(
        `http://127.0.0.1:8000/users/details/${localStorage.getItem("id")}/`, 
        {
          attendee_details: {
            first_name: newFirstName,
            last_name: newLastName,
            birth_date: newBirthDate,
          }
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
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
    console.log(userData);
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          {/* Left Sidebar with options */}
          
        <div className="list-group">
          <button className="list-group-item list-group-item-action" onClick={() => console.log("View Liked Events")}>View Liked Events</button>
          <button className="list-group-item list-group-item-action" onClick={() => console.log("Booked Events")}>Booked Events</button>
          <button className="list-group-item list-group-item-action" onClick={() => console.log("Paid Events")}>Paid Events</button>
          {/* Add more options/buttons as needed */}
        
      </div>
        </div>

        <div className="col-md-9">
          {/* Main Content */}
          <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '70px' ,backgroundColor: '#f0f0f0',width: '800px', height: '300px',borderRadius: '10px' }}>
            <h2 className="mt-4 mb-3">Profile Personal:</h2>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">First Name:</label>
              <div className="col-sm-10">{userData.attendee_details.first_name}</div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Last Name:</label>
              <div className="col-sm-10">{userData.attendee_details.last_name}</div>
            </div>
            <div className="row mb-3">
              <label className="col-sm-2 col-form-label">Birth Date:</label>
              <div className="col-sm-10">{userData.attendee_details.birth_date}</div>
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