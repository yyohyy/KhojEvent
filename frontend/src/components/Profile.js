import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProfileDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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
  const { id } = useParams(); // Get the profile ID from the URL parameter

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
      setNewFacebookLink(userData.organiser_details.facebook || '');
      setNewInstagramLink(userData.organiser_details.instagram || '');
      setNewTwitterLink(userData.organiser_details.twitter || '');
      setNewWebsiteLink(userData.organiser_details.website || '');
    }
  };

  const handleSave = async () => {
    try {
      const authToken = localStorage.getItem("Bearer");
      let requestData = {};
      if (userData.attendee_details) {
        requestData = {
          attendee_details: {
            first_name: newFirstName,
            last_name: newLastName,
            birth_date: newBirthDate,
          },
        };
      } else if (userData.organiser_details) {
        requestData = {
          organiser_details: {
            name: newName,
            description: newDescription,
            address: newAddress,
            facebook: newFacebookLink,
            instagram: newInstagramLink,
            twitter: newTwitterLink,
            website: newWebsiteLink,
          },
        };
      }
      if (userData.organiser_details) {
        requestData.organiser_details = {
          ...requestData.organiser_details,
          facebook: newFacebookLink,
          instagram: newInstagramLink,
          twitter: newTwitterLink,
          website: newWebsiteLink,
        };
      }
      const response = await axios.patch(
        `http://127.0.0.1:8000/users/details/${localStorage.getItem("id")}/`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
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
    setEditing(false);
  };

  const handleOk = () => {
    // This function will handle the "OK" button click event
    // Here you can perform any action before saving the changes
    // In this case, we'll just call the handleSave function
    handleSave();
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <div className="list-group">
            <button
              className="list-group-item list-group-item-action"
              onClick={() => console.log("View Liked Events")}
            >
              View Liked Events
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => console.log("Booked Events")}
            >
              Booked Events
            </button>
            <button
              className="list-group-item list-group-item-action"
              onClick={() => console.log("Paid Events")}
            >
              Paid Events
            </button>
            {/* Add more options/buttons as needed */}
          </div>
        </div>
        <div className="col-md-7">
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "70px",
              backgroundColor: "#f0f0f0",
              borderRadius: "10px",
            }}
          >
            <h2 className="mt-4 mb-3">Profile Personal:</h2>
            {userData.attendee_details && (
              <>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label">First Name:</label>
                  <div className="col-sm-10">
                    {userData.attendee_details.first_name}
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label">Last Name:</label>
                  <div className="col-sm-10">
                    {userData.attendee_details.last_name}
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label">Birth Date:</label>
                  <div className="col-sm-10">
                    {userData.attendee_details.birth_date}
                  </div>
                </div>
              </>
            )}
            {userData.organiser_details && (
              <>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label">Name:</label>
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
                  <label className="col-sm-2 col-form-label">Address:</label>
                  <div className="col-sm-10">
                    <div className="border p-2 rounded bg-white">
                      {userData.organiser_details.address}
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label">Facebook:</label>
                  <div className="col-sm-10">
                    {useLinkInputs ? (
                      <input
                        type="text"
                        className="form-control"
                        value={newFacebookLink}
                        onChange={(e) => setNewFacebookLink(e.target.value)}
                        placeholder="Facebook Link"
                      />
                    ) : (
                      <a href={newFacebookLink} target="_blank" rel="noopener noreferrer">{newFacebookLink}</a>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label">Instagram:</label>
                  <div className="col-sm-10">
                    {useLinkInputs ? (
                      <input
                        type="text"
                        className="form-control"
                        value={newInstagramLink}
                        onChange={(e) => setNewInstagramLink(e.target.value)}
                        placeholder="Instagram Link"
                      />
                    ) : (
                      <a href={newInstagramLink} target="_blank" rel="noopener noreferrer">{newInstagramLink}</a>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label">Twitter:</label>
                  <div className="col-sm-10">
                    {useLinkInputs ? (
                      <input
                        type="text"
                        className="form-control"
                        value={newTwitterLink}
                        onChange={(e) => setNewTwitterLink(e.target.value)}
                        placeholder="Twitter Link"
                      />
                    ) : (
                      <a href={newTwitterLink} target="_blank" rel="noopener noreferrer">{newTwitterLink}</a>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <label className="col-sm-2 col-form-label">Website:</label>
                  <div className="col-sm-10">
                    {useLinkInputs ? (
                      <input
                        type="text"
                        className="form-control"
                        value={newWebsiteLink}
                        onChange={(e) => setNewWebsiteLink(e.target.value)}
                        placeholder="Website Link"
                      />
                    ) : (
                      <a href={newWebsiteLink} target="_blank" rel="noopener noreferrer">{newWebsiteLink}</a>
                    )}
                  </div>
                </div>
              </>
            )}
            {!editing ? (
              <div>
                <p style={{ display: "inline" }}>Do you want to edit?</p>
                <button className="btn btn-link" onClick={handleEdit}>
                  Edit
                </button>
              </div>
            ) : (
              <div className="row mb-3">
                {userData.attendee_details && (
                  <>
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
                  </>
                )}
                {userData.organiser_details && (
                  <>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Name"
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Address"
                      />
                    </div>
                    </>
                )}
                <div className="col">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleOk} /* Change handleSave to handleOk */
                    style={{ marginRight: "5px" }}
                  >
                    OK {/* Change Save to OK */}
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            <div className="row mt-3">
              <div className="col">
                <button
                  className="btn btn-link"
                  onClick={() => setUseLinkInputs(!useLinkInputs)}
                >
                  {useLinkInputs ? "Use text inputs" : "Use link inputs"}
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
