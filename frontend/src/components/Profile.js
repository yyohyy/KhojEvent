// ProfileDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const ProfileDashboard = () => {
  const navigate = useNavigate(); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newBirthDate, setNewBirthDate] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newFacebookLink, setNewFacebookLink] = useState("");
  const [newInstagramLink, setNewInstagramLink] = useState("");
  const [newTwitterLink, setNewTwitterLink] = useState("");
  const [newWebsiteLink, setNewWebsiteLink] = useState("");
  const [useLinkInputs, setUseLinkInputs] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/users/details/${localStorage.getItem("id")}/`
        );
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleEdit = () => {
    setEditing(true);
    if (userData.attendee_details) {
      setNewFirstName(userData.attendee_details.first_name);
      setNewLastName(userData.attendee_details.last_name);
      setNewBirthDate(userData.attendee_details.birth_date);
    } else if (userData.organiser_details) {
      setNewName(userData.organiser_details.name);
      setNewDescription(userData.organiser_details.description);
      setNewAddress(userData.organiser_details.address);
      setNewFacebookLink(userData.organiser_details.facebook || "");
      setNewInstagramLink(userData.organiser_details.instagram || "");
      setNewTwitterLink(userData.organiser_details.twitter || "");
      setNewWebsiteLink(userData.organiser_details.website || "");
    }
  };

  const handleSave = async () => {
    try {
      const authToken = localStorage.getItem("Bearer");
      const requestData = new FormData();

      if (profilePicture) {
        requestData.append("profile_picture", profilePicture);
      }

      if (userData.attendee_details) {
        requestData.append("attendee_details[first_name]", newFirstName);
        requestData.append("attendee_details[last_name]", newLastName);
        requestData.append("attendee_details[birth_date]", newBirthDate);
      } else if (userData.organiser_details) {
        requestData.append("organiser_details[name]", newName);
        requestData.append("organiser_details[description]", newDescription);
        requestData.append("organiser_details[address]", newAddress);
        requestData.append("organiser_details[facebook]", newFacebookLink);
        requestData.append("organiser_details[instagram]", newInstagramLink);
        requestData.append("organiser_details[twitter]", newTwitterLink);
        requestData.append("organiser_details[website]", newWebsiteLink);
      }

      const response = await axios.patch(
        `http://127.0.0.1:8000/users/details/${localStorage.getItem("id")}/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserData(response.data);
      setEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (!profilePicture) {
        console.error("Profile picture is not selected.");
        return;
      }

      const formData = new FormData();
      formData.append("profile_picture", profilePicture);
      const authToken = localStorage.getItem("Bearer");

      const response = await axios.patch(
        `http://127.0.0.1:8000/users/details/${localStorage.getItem("id")}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile picture uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleViewLikedEvents = () => {
    console.log("View Liked Events");
    // Navigate to the 'Liked Events' page
    navigate(`/profile/${localStorage.getItem("id")}/interested`);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3"></div>
        <div className="col-md-8">
          <div className="card bg-light p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h2 className="card-title">Profile Personal:</h2>
              {userData && (
                <div className="col text-end">
                  {userData.profile_picture ? (
                    <img
                      src={userData.profile_picture}
                      alt="Profile"
                      className="img-thumbnail rounded-circle"
                      style={{ width: "100px", height: "100px" }}
                    />
                  ) : (
                    <div
                      className="img-thumbnail rounded-circle"
                      style={{
                        width: "100px",
                        height: "100px",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center",
                      }}
                    >
                      <span className="text-muted">No Profile Picture</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="file"
                  className="form-control-file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="col">
                <button className="btn btn-link" onClick={handleUpload}>
                  Upload
                </button>
              </div>
            </div>
            {/* Rest of the profile details */}
            <div className="d-flex justify-content-between align-items-center"></div>
            {userData && (
              <>
                {userData.attendee_details && (
                  <>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">
                        First Name:
                      </label>
                      <div className="col-sm-10">
                        {userData.attendee_details.first_name}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">
                        Last Name:
                      </label>
                      <div className="col-sm-10">
                        {userData.attendee_details.last_name}
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">
                        Birth Date:
                      </label>
                      <div className="col-sm-10">
                        {userData.attendee_details.birth_date}
                      </div>
                    </div>
                  </>
                )}
                {userData.organiser_details && (
                  <>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">
                        Name:
                      </label>
                      <div className="col-sm-10">
                        <div className="border p-2 rounded bg-white">
                          {userData.organiser_details.name}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">
                        Description:
                      </label>
                      <div className="col-sm-10">
                        <div className="border p-2 rounded bg-white">
                          {userData.organiser_details.description}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <label className="col-sm-2 col-form-label">
                        Address:
                      </label>
                      <div className="col-sm-10">
                        <div className="border p-2 rounded bg-white">
                          {userData.organiser_details.address}
                        </div>
                      </div>
                    </div>
                    <div className="col">
                <button
                  className="btn btn-link"
                  onClick={() => setUseLinkInputs(!useLinkInputs)}
                >
                  {useLinkInputs ? "Use text inputs" : "Use link inputs"}
                </button>
              </div>
                  </>
                )}
              </>
            )}
            {editing ? (
              <div className="row mb-3">
                <div className="col">
                  {/* Input fields for editing user data */}
                </div>
                <div className="col">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleSave}
                    style={{ marginRight: "5px" }}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ display: "inline" }}>Do you want to edit?</p>
                <button
                  className="btn btn-link"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              </div>
            )}
            <div className="row mt-3">
            
              <div className="col">
                <button
                  className="btn btn-link"
                  onClick={handleViewLikedEvents}
                >
                  View Liked Events
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
