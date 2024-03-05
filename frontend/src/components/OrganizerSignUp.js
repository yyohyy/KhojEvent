
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrganizerSignup = () => {
  const navigate = useNavigate();
  const [organizerData, setOrganizerData] = useState({
    // Common fields
    name:"",
    description:"",
    phone_number:"",
    street: "",
    area:"",
    city:"",
    district:"",
    province: "",
    country: "",
    // Individual specific fields
    pan_no: "",
    citizenship_no: "",
    citizenship_photo_front: null,
    citizenship_photo_back: null,
    // Business specific fields
    business_registration_no: "",
    // Add more fields as needed
  });
  const [organizationType, setOrganizationType] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrganizerData({ ...organizerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve the authentication token from local storage
      const authToken = localStorage.getItem('Bearer'); // Replace with the actual key you used for storing the token

      if (!authToken) {
        // Handle the case when the token is not available
        console.error('Authentication token not found in local storage');
        return;
      }
      console.log(authToken);
      // Make another API call with the obtained token
      const response = await axios.post('http://127.0.0.1:8000/users/organiser/', organizerData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // If the post request is successful
      if (response.status === 201) {
        // Get the organizer ID from the response
        const id=localStorage.getItem("id")
        // Make a patch request to update phone number
        const updateResponse = await axios.patch(`http://127.0.0.1:8000/users/details/${id}/`, {
          id: id,
          phone_number: organizerData.phone_number,
        }, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Handle response for phone number update
        if (updateResponse.status === 200) {
          // Handle successful organizer signup and phone number update
          console.log('Organizer signup successful:', response.data);
          console.log('Phone number update successful:', updateResponse.data);

          // Navigate to the home page
          navigate('/');
          window.location.reload();
        } else {
          console.error('Phone number update failed:', updateResponse.data);
        }
      } else {
        console.error('Organizer signup failed:', response.data);
      }
    } catch (error) {
      console.error('Organizer signup error:', error.response?.data || error.message);
    }
  };

  const handleOrganizationTypeChange = (type) => {
    setOrganizationType(type);
    // Reset form data when organization type changes
    setOrganizerData({
 
      name:"",
      description:"",
      phone_number:"",
      street:"",
      area:"",
      city: "",
      province: "",
      country: "",
      pan_no: "",
      citizenship_no: "",
      citizenship_photo_front: "",
      citizenship_photo_back: "",
      business_registration_no: "",
    });
  };

  return (
    <div className="auth-form-container d-flex flex-column justify-content-between align-items-center" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
      <div className="card p-4 shadow rounded" style={{ width: '700px' }}>
        <h3 className="mb-4 text-center">Organizer Sign Up</h3>
        <div className="mb-3">
          <label className="form-label text-center mb-4">Select a type:</label>
          <div className="d-flex justify-content-center">
          <button
  className={`btn ${organizationType === 'individual' ? 'btn-primary' : 'btn btn-outline'}`}
  style={{ marginRight: '10px' }}
  onClick={() => handleOrganizationTypeChange('individual')}
>
  Individual
</button>
<button
  className={`btn ${organizationType === 'business' ? 'btn-primary' : 'btn btn-outline'}`}
  onClick={() => handleOrganizationTypeChange('business')}
>
  Registered Business
</button>

          </div>
        </div>
        {organizationType && (
          <form onSubmit={handleSubmit}>
            {/* Common fields */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                 Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter official Name"
                name="name"
                value={organizerData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group mt-4">
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
<div className="form-group mt-4">
              <label htmlFor="phone_number" className="form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="phone_number"
                placeholder="Enter Phone Number"
                name="phone_number"
                value={organizerData.phone_number}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="row mt-4">
            <label className="form-label">Address:</label>
  <div className="col-md-4">
    <div className="form-group">
      <label htmlFor="street" className="form-label">
        Street
      </label>
      <input
        type="text"
        className="form-control"
        id="street"
        placeholder="Your Street"
        name="street"
        value={organizerData.street}
        onChange={handleInputChange}
        required
      />
    </div>
      </div>
      <div className="col-md-4">
    <div className="form-group">
      <label htmlFor="area" className="form-label">
        Area
      </label>
      <input
        type="text"
        className="form-control"
        id="area"
        placeholder="Your area"
        name="area"
        value={organizerData.area}
        onChange={handleInputChange}
        required
      />
    </div>
      </div>
      <div className="col-md-4">
    <div className="form-group">
      <label htmlFor="city" className="form-label">
        City
      </label>
      <input
        type="text"
        className="form-control"
        id="city"
        placeholder="Your city"
        name="city"
        value={organizerData.city}
        onChange={handleInputChange}
        required
      />
    </div>
      </div>

</div>
<div className="row">
<div className="col-md-4">
    <div className="form-group">
      <label htmlFor="district" className="form-label">
        District
      </label>
      <input
        type="text"
        className="form-control"
        id="district"
        placeholder="District"
        name="district"
        value={organizerData.district}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
  <div className="col-md-4">
    <div className="form-group">
      <label htmlFor="province" className="form-label">
        Province
      </label>
      <input
        type="text"
        className="form-control"
        id="province"
        placeholder="Your Province"
        name="province"
        value={organizerData.province}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
  <div className="col-md-4">
    <div className="form-group">
      <label htmlFor="country" className="form-label">
        Country
      </label>
      <input
        type="text"
        className="form-control"
        id="country"
        placeholder="Your Country"
        name="country"
        value={organizerData.country}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
</div>


            {/* Individual specific fields */}
            {organizationType === 'individual' && (
              <>
              <div className="row mt-4">
              <label className="form-label">Identification:</label>
  <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="pan_no" className="form-label">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pan_no"
                    placeholder="Your PAN Number"
                    name="pan_no"
                    value={organizerData.pan_no}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="citizenship_no" className="form-label">
                    Citizenship Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="citizenship_no"
                    placeholder="Your Citizenship Number"
                    name="citizenship_no"
                    value={organizerData.citizenship_no}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                </div>
                </div>
                <div className="row">
  <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="citizenship_photo_front" className="form-label">
                    Citizenship Photo (Front)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="citizenship_photo_front"
                    name="citizenship_photo_front"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="citizenship_photo_back" className="form-label">
                    Citizenship Photo (Back)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="citizenship_photo_back"
                    name="citizenship_photo_back"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                </div>
                </div>
              </>
            )}
            {/* Business specific fields */}
            {organizationType === 'business' && (
              <>
            <div className="row mt-4">
            <label className="form-label">Business Details:</label>
  <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="business_registration_no" className="form-label">
                    Business Registration Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="business_registration_no"
                    placeholder="Your Business Registration Number"
                    name="business_registration_no"
                    value={organizerData.business_registration_no}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                </div>
                <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="pan_no" className="form-label">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pan_no"
                    placeholder="Your PAN Number"
                    name="pan_no"
                    value={organizerData.pan_no}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                </div>
                </div>
              </>
            )}

<p className="text-muted mb-4">
          Please enter your details carefully and review it as they cannot be edited later.
        </p>
            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary">
                Sign Up as {organizationType.charAt(0).toUpperCase() + organizationType.slice(1)}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default OrganizerSignup;
