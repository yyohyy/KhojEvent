import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "./ProfileSidebar";

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [reloadImage, setReloadImage] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [newEmail, setNewEmail] = useState("");
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
  }, [id,reloadImage]);
  useEffect(() => {
    console.log("UserData before update:", userData);
  }, [userData]);
  const handleEdit = () => {
    setEditing(true);
    if (userData.attendee_details) {
      setNewEmail(userData.email);
      setNewFirstName(userData.attendee_details.first_name);
      setNewLastName(userData.attendee_details.last_name);
      setNewBirthDate(userData.attendee_details.birth_date);
    } else if (userData.organiser_details) {
      setNewEmail(userData.email);
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
      const authToken = localStorage.getItem('Bearer');
      let requestData = {};
      if (userData.attendee_details) {
        requestData = {
          attendee_details: {
            email:newEmail,
            first_name: newFirstName,
            last_name: newLastName,
            birth_date: newBirthDate,
          }
        };
      } else if (userData.organiser_details) {
        requestData = {
          organiser_details: {
            email:newEmail,
            name: newName,
            description: newDescription,
            address: newAddress,
            // facebook: newFacebook,
            // instagram: newInstagram,
            // twitter: newTwitter,
            // website: newWebsite,
          }
        };
      }

      const response = await axios.patch(
        `http://127.0.0.1:8000/users/details/${localStorage.getItem("id")}/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            // "Content-Type": "multipart/form-data",
          
          },
        }
      );

      setUserData(response.data);
      window.location.reload()
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
      setUserData((prevUserData) => ({
        ...prevUserData,
        profile_picture: response.data.profile_picture,
      }));

      console.log("Profile picture uploaded successfully:", response.data);
      setReloadImage((prev) => !prev);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

   return (
    <div className="container" style={{ paddingBottom: "50px" }}>
      <div className="row">
        <div className="col-md-3">
          <ProfileSidebar />
        </div>
        <div className="col-md-9">
        <div className="card">
  <div className="card-body">
    <div className="row">
      <div className="col-md-8">
        <h2 className="card-title mb-8">Profile Personal:</h2>
        <div className="row mb-12 mt-6">
          <div className="col">
            <input
              type="file"
              className="form-control-file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="col">
            <button className="btn btn-danger" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>
        {/* Display personal information fields here */}
        {/* Edit and Save/Cancel buttons */}
      </div>
      <div className="col-md-4">
        {userData && (
          <div className="col text-end">
            {userData.profile_picture ? (
              <img
                src={userData.profile_picture}
                alt="Profile"
                className="img-thumbnail rounded-circle"
                style={{
                  width: "200px",
                  height: "200px",
                  border: "1px solid",
                }}
              />
            ) : (
              <div
                className="img-thumbnail rounded-circle"
                style={{
                  width: "200px",
                  height: "200px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span className="text-muted">No Profile Picture</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
              {userData && (
                <>
                  {userData.attendee_details && (
                    <>
                    <div className="row mb-3 mt-4">
                        <label className="col-sm-2 col-form-label">
                          Email:
                        </label>
                        <div className="col-sm-10">
                          {editing ? (
                            <input
                              type="text"
                              className="form-control"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                            />
                          ) : (
                            userData.email
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">
                          First Name:
                        </label>
                        <div className="col-sm-10">
                          {editing ? (
                            <input
                              type="text"
                              className="form-control"
                              value={newFirstName}
                              onChange={(e) => setNewFirstName(e.target.value)}
                            />
                          ) : (
                            userData.attendee_details.first_name
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">
                          Last Name:
                        </label>
                        <div className="col-sm-10">
                          {editing ? (
                            <input
                              type="text"
                              className="form-control"
                              value={newLastName}
                              onChange={(e) => setNewLastName(e.target.value)}
                            />
                          ) : (
                            userData.attendee_details.last_name
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">
                          Birth Date:
                        </label>
                        <div className="col-sm-10">
                          {editing ? (
                            <input
                              type="date"
                              className="form-control"
                              value={newBirthDate}
                              onChange={(e) => setNewBirthDate(e.target.value)}
                            />
                          ) : (
                            userData.attendee_details.birth_date
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {userData.organiser_details && (
                    <>
                    <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">Email:</label>
                        <div className="col-sm-10">
                          {editing ? (
                            <input
                              type="text"
                              className="form-control"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value)}
                            />
                          ) : (
                            userData.email
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">Name:</label>
                        <div className="col-sm-10">
                          {editing ? (
                            <input
                              type="text"
                              className="form-control"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                            />
                          ) : (
                            userData.organiser_details.name
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">
                          Description:
                        </label>
                        <div className="col-sm-10">
                          {editing ? (
                            <textarea
                              className="form-control"
                              value={newDescription}
                              onChange={(e) =>
                                setNewDescription(e.target.value)
                              }
                            />
                          ) : (
                            userData.organiser_details.description
                          )}
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">
                          Address:
                        </label>
                        <div className="col-sm-10">
                          {editing ? (
                            <input
                              type="text"
                              className="form-control"
                              value={newAddress}
                              onChange={(e) => setNewAddress(e.target.value)}
                            />
                          ) : (
                            userData.organiser_details.address
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              <div className="row mt-3">
                <div className="col">
                  {editing ? (
                    <>
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
                    </>
                  ) : (
                    <button className="btn btn-primary" onClick={handleEdit}>
                      Edit
                    </button>
                  )}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
