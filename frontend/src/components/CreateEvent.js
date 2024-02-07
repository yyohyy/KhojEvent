import React, { useState } from 'react';
import './CreateEvent.css';
import AxiosInstance from './axios';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const navigate = useNavigate();

  const defaultValues = {
    name: '',
    category: 'Music',
    venue: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    tags: [],
    is_paid: 'False',
    image: null,
  };

  const [formData, setFormData] = useState(defaultValues);

  const submission = async (data) => {
    try {
      const formattedData = {
        name: data.name,
        category: { name: data.category },
        description: data.description,
        venue: data.venue,
        start_date: data.start_date,
        end_date: data.end_date,
        start_time: data.start_time,
        end_time: data.end_time,
        tags: data.tags.map((tag) => ({ name: tag })),
        is_paid: data.is_paid,
        image: data.image,
      };

      const response = await AxiosInstance.post('create-event/', formattedData);

      console.log('Response from backend:', response);
      navigate('/');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const category = ['Art', 'Business and Profession', 'Fashion', 'Education', 'Theatre', 'Standup', 'Market', 'Others'];
  const availableTags = ['Fun', 'Dance', 'Music', 'Seminar', 'Night', 'Games', 'Food', 'Crafts', 'Zen', 'Comedy', 'Film', 'Photography', 'Tech', 'Thrift', 'Donation', 'Marathon', 'Cycling', 'Nature', 'Health', 'Pottery', 'Book', 'Meet & Greet'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const toggleTag = (tag) => {
    const updatedTags = formData.tags.includes(tag) ? formData.tags.filter((t) => t !== tag) : [...formData.tags, tag];
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submission(formData);
  };

  return (
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

      <div className="date-time-container">
        <div className="date-container">
          <label>
            Start Date:
            <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} />
          </label>

          <label>
            End Date:
            <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} />
          </label>
        </div>

        <div className="time-container">
          <label>
            Start Time:
            <input type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} />
          </label>

          <label>
            End Time:
            <input type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} />
          </label>
        </div>
      </div>

      <label>
        Event Image:
        <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
      </label>

      <label>
        Tags:
        <div className="tags-container">
          {availableTags.map((tag) => (
            <div key={tag} className={`tag ${formData.tags.includes(tag) ? 'selected' : ''}`} onClick={() => toggleTag(tag)}>
              {tag}
            </div>
          ))}
        </div>
      </label>

      <div className="ticket-type-container">
        <label className="ticket-type-label"></label>

        <div className="ticket-options">
          <label>
            <input
              type="radio"
              name="is_paid"
              value="False"
              checked={formData.is_paid === 'False'}
              onChange={handleInputChange}
            />
            Free
          </label>

          <label>
            <input
              type="radio"
              name="is_paid"
              value="True"
              checked={formData.is_paid === 'True'}
              onChange={handleInputChange}
            />
            Paid
          </label>
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default CreateEvent;
