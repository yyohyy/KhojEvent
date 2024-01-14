// CreateEvent.js
import React, { useState } from 'react';
import './CreateEvent.css'; // Import the CSS file for styling
import AxiosInstance from './axios'
// TODO: Need to have a database that can store the input data which is stored in formData
// TODO: 

const CreateEvent = () => {

  const defaultValues ={
    name: '',
    category: 'music', // Default category
    venue: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    tags: [], // Store tags as an array
    ticketType: 'free',


  }
  const submission =(data) => {
    AxiosInstance.post( 'create-event/',{
      name:data.name,
      category: data.category,
      venue: data.venue,
      description:data.description,
      startDate: data.startDate,
      endDate:data.endDate,
      startTime:data.startTime,
      endTime:data.endTime,
      tags:data.tags,
      ticketType:data.ticketType,
    })
  }

  const [formData, setFormData] = useState({
    name: '',
    category: 'music', // Default category
    venue: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    tags: [], // Store tags as an array
    ticketType: 'free', // Default ticket type
  });

  const categories = ['music', 'art', 'fashion', 'education', 'theatre', 'standup', 'market', 'others'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagInputChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, tags: value.split(',').map((tag) => tag.trim()) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add logic to handle form submission, e.g., send data to server
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
          {categories.map((cat) => (
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
            <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
          </label>

          <label>
            End Date:
            <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
          </label>
        </div>

        <div className="time-container">
          <label>
            Start Time:
            <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} />
          </label>

          <label>
            End Time:
            <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} />
          </label>
        </div>
      </div>

      <label>
        Tags:
        <input type="text" name="tags" value={formData.tags.join(',')} onChange={handleTagInputChange} />
      </label>

      <div className="ticket-type-container">
        <label className="ticket-type-label">Event Type:</label>

        <div className="ticket-options">
          <label>
            <input
              type="radio"
              name="ticketType"
              value="free"
              checked={formData.ticketType === 'free'}
              onChange={handleInputChange}
            />
            Free
          </label>

          <label>
            <input
              type="radio"
              name="ticketType"
              value="paid"
              checked={formData.ticketType === 'paid'}
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