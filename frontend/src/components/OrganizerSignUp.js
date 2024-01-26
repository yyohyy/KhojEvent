import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrganizerSignup = () => {
  const navigate = useNavigate();
  const [organizerData, setOrganizerData] = useState({
    // Include any additional fields specific to organizer signup
    name: "",
    address:"",
    description:""
    // Add more fields as needed
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganizerData({ ...organizerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to handle organizer signup
      const response = await axios.post(
        "http://127.0.0.1:8000/users/organiser/",
        organizerData
      );

      // Handle the response, show a success message or navigate to another page if needed
      console.log("Organiser signup successful:", response.data);

      // Navigate to the home page
      navigate("/");
    } catch (error) {
      // Handle organizer signup failure
      console.error("Organiser signup error:", error.response.data);
    }
  };

  return (
    <div className="container pt-5">
      <div className="row justify-content-center">
        <div className="col-sm-8 col-md-6">
          <div className="card p-4 shadow rounded">
            <h3 className="mb-4 text-center">Organizer Sign Up</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Organization Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Your Organization Name"
                  name="name"
                  value={organizerData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  placeholder="Your Address"
                  name="address"
                  value={organizerData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  placeholder="Your Description"
                  name="description"
                  value={organizerData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* Add more fields as needed for organizer signup */}
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Sign Up as Organizer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerSignup;
