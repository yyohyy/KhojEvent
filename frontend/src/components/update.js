import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Row, Col } from 'react-bootstrap';
import './CreateEvent.css';
import AxiosInstance from './axios';
import { useParams, useNavigate } from 'react-router-dom';

import ProfileSidebar from './ProfileSidebar';

const Update = () => {
  const navigate = useNavigate();
  const { event_id } = useParams();

  const [eventDetails, setEventDetails] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    venue: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    tags: [],
    is_paid: 'False',
    organiser: '',
  });
  const [isOrganiser, setIsOrganiser] = useState(false);
  const [newImage, setNewImage] = useState(null); // State to track the newly uploaded image
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('Bearer');
    if (token) {
      AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Fetch event details
    AxiosInstance.get(`http://127.0.0.1:8000/events/${event_id}/`)
      .then(response => {
        setEventDetails(response.data);
        setFormData({
          name: response.data.name,
          category: response.data.category.name,
          venue: response.data.venue,
          description: response.data.description,
          start_date: response.data.start_date,
          end_date: response.data.end_date,
          start_time: response.data.start_time,
          end_time: response.data.end_time,
          tags: response.data.tags,
          is_paid: response.data.is_paid,
          organiser: response.data.organiser,
        });
      })
      .catch(error => {
        console.error('Error fetching event details:', error);
      });

    // Fetch user data including is_organiser field
    AxiosInstance.get(`http://127.0.0.1:8000/users/me/`)
      .then(response => {
        setIsOrganiser(response.data.is_organiser);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [event_id]);

  const category = ['Art and Entertainment', 'Business and Profession', 'Fashion', 'Education', 'Theatre', 'Standup', 'Market', 'Music and Concert', 'Festival', 'Others'];
  const availableTags = ['Fun', 'Dance', 'Music', 'Seminar', 'Night', 'Games', 'Food', 'Crafts', 'Zen', 'Comedy', 'Film', 'Photography', 'Tech', 'Thrift', 'Donation', 'Marathon', 'Cycling', 'Nature', 'Health', 'Pottery', 'Book', 'Meet & Greet'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file); // Store the newly uploaded image
  };

  const toggleTag = (tag) => {
    const updatedTags = formData.tags.some(t => t.name === tag)
      ? formData.tags.filter((t) => t.name !== tag) // Remove the tag if it exists
      : [...formData.tags, { name: tag }]; // Add the tag if it doesn't exist
    setFormData({ ...formData, tags: updatedTags });
  };
  
  
  const handleTicketUpdate = () => {
    navigate(`/profile/${localStorage.getItem("id")}/events/update/tickets/${event_id}`);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithoutImage = { ...formData };

      // Check if formData.category and formData.tags exist before formatting them
      const formattedCategory = {name: formData.category};
      const formattedTags = formData.tags ? formData.tags.map(tag => (tag)) : [];

      const formattedData = {
        ...formDataWithoutImage,
        category: formattedCategory,
        tags: formattedTags,
      };

      await AxiosInstance.patch(`http://127.0.0.1:8000/event-update/${event_id}/`, formattedData);

      if (newImage) {
        const formDataForImage = new FormData();
        formDataForImage.append('image', newImage);

        await AxiosInstance.patch(`http://127.0.0.1:8000/event/${event_id}/image/`, formDataForImage, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      console.log('Event updated successfully');
      navigate(`/events/${event_id}`);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };
  
  return (
    <Container fluid style={{ minHeight: "calc(100vh - 56px)", background: "#ffffff" }}>
    <div class="custom-container"></div>
    <Row>
        <Col sm={3}>
            <ProfileSidebar />
        </Col>
        <Col sm={9}>
    <div>
      {isOrganiser && eventDetails && (
        <div>
          <form onSubmit={handleSubmit} className="event-form">
            <label>
              Name:
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </label>
            <label>
              Category:
              <select name="category" value={formData.category} onChange={handleInputChange}>
                {category.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Venue:
              <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} />
            </label>

            <label>
              Description:
              <textarea name="description" value={formData.description} onChange={handleInputChange} />
            </label>

            <label>
              Start Date:
              <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
            </label>

            <label>
              End Date:
              <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} />
            </label>

            <label>
              Start Time:
              <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} />
            </label>

            <label>
              End Time:
              <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} />
            </label>

            <label>
              Tags:
              <div className="tags-container mb-4">
  {availableTags && availableTags.map((tag) => (
    <div key={tag} className={`tag ${formData.tags.some(t => t.name === tag) ? 'selected' : ''}`} onClick={() => toggleTag(tag)}>
      {tag}
    </div>
  ))}
</div>


            </label>
            <label>Upload New Image:
            <div className="image-container" style={{ textAlign: 'center', paddingBottom: '20px' }}>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: '10px' }} />
            </div>
            </label>
           
            <Button variant="danger" onClick={() => handleTicketUpdate()}>Update Ticket</Button>
            <div className="form-footer">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      )}
    </div>
    </Col>
            </Row>
                            
        </Container>
  );
};

export default Update;
