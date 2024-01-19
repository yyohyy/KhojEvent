// CreateEvent.js
import React, { useState } from 'react';
import './CreateEvent.css'; // Import the CSS file for styling
import AxiosInstance from './axios'
import { useNavigate } from 'react-router-dom';
import { Axios } from 'axios';
// TODO: Need to have a database that can store the input data which is stored in formData
// TODO: 

const CreateEvent = () => {
const navigate = useNavigate()
  const defaultValues ={
    name: '',
    categories: 'Music', // Default category
    venue: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    tags: [], // Store tags as an array
    is_paid: 'False',


  }
  const submission = (data) => {
    console.log('Submitting data:', data);
  
    // Transform formData to match the desired format
    const formattedData = {
      name: data.name,
      categories: {
        name: data.categories,
      },
      description: data.description,
      venue: data.venue,
      start_date: data.start_date,
      end_date: data.end_date,
      start_time: data.start_time,
      end_time: data.end_time,
      tags: data.tags.map(tag => ({ name: tag })),
      is_paid: data.is_paid,
    };
  
    console.log(formattedData)
    AxiosInstance.post('create-event/', formattedData)
      .then((res) => {
        console.log('Response from backend:', res);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error submitting data:', error);
      });
  };
  
  // const submission =(data) => {
  //   console.log('Submitting data:', data);
  //   AxiosInstance.post( 'create-event/',{
  //     name:data.name,
  //     categories: data.categories,
  //     venue: data.venue,
  //     description:data.description,
  //     start_date: data.start_date,
  //     end_date:data.end_date,
  //     start_time:data.start_time,
  //     end_time:data.end_time,
  //     tags:data.tags,
  //     is_paid:data.is_paid,
  //   })
  //   .then((res) => {
  //     console.log('Response from backend:', res);
  //     navigate('/');
  //   })
  //   .catch((error) => {
  //     console.error('Error submitting data:', error);
  //   });
  // }

  const [formData, setFormData] = useState({
    name: '',
    categories: 'Music', // Default category
    venue: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    tags: [], // Store tags as an array
    is_paid: 'False', // Default ticket type
  });

  const categories = ['Art', 'Business and Profession', 'Fashion', 'Education', 'Theatre', 'Standup', 'Market', 'Others'];
  const [availableTags, setAvailableTags] = useState(['Fun', 'Dance', 'Music','Seminar','Night','Games','Food','Crafts','Zen','Comedy','Film','Photography','Tech','Thrift','Donation','Marathon','Cycling','Nature','Health','Pottery','Book','Meet & Greet']); // Replace with your actual tags
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleTagInputChange = (e) => {
  //   const { value } = e.target;
  //   setFormData({ ...formData, tags: value.split(',').map((tag) => tag.trim()) });
  // };
  const toggleTag = (tag) => {
    const updatedTags = formData.tags.includes(tag)
      ? formData.tags.filter((t) => t !== tag)
      : [...formData.tags, tag];
  
    setFormData({ ...formData, tags: updatedTags });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add logic to handle form submission, e.g., send data to server
    submission(formData);
    }
  


  return (
    <form onSubmit={handleSubmit} className="event-form">
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
      </label>

      <label>
        Categories:
        <select name="categories" value={formData.categories} onChange={handleInputChange}>
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

      {/* <label>
        Tags:
        <input type="text" name="tags" value={formData.tags.join(',')} onChange={handleTagInputChange} />
      </label> */}

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
<<<<<<< HEAD
              name="ticketType"
              value="free"
              checked={formData.is_paid === 'free'}
=======
              name="is_paid"
              value="False"
              checked={formData.is_paid === 'False'}
>>>>>>> ce552da89d3e9c6c59ccb3e65cd8828d53ab5ba3
              onChange={handleInputChange}
            />
            Free
          </label>

          <label>
            <input
              type="radio"
<<<<<<< HEAD
              name="ticketType"
              value="paid"
              checked={formData.is_paid === 'paid'}
=======
              name="is_paid"
              value="True"
              checked={formData.is_paid === 'True'}
>>>>>>> ce552da89d3e9c6c59ccb3e65cd8828d53ab5ba3
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