import React, { useState, useEffect } from 'react';
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
    ticketTypes: [],
  };

  useEffect(() => {
    // Fetch and set the authentication token when the component mounts
    const token = localStorage.getItem('Bearer');
    if (token) {
      AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const [formData, setFormData] = useState(defaultValues);
  const [paidSelected, setPaidSelected] = useState(false);

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
        ticket_types: data.ticketTypes.map((ticket) => ({
          ...ticket,
          quantity_available: ticket.quantity, // Set quantity_available to the same value as quantity
        })),
      };
      

      const response = await AxiosInstance.post('create-event/', formattedData);
      const eventId = response.data.id;

      if (data.is_paid === 'True') {
        // Submit ticket data if paid option is chosen
        const ticketResponse = await AxiosInstance.post(`tickets/${eventId}/create/`, { ticket_types: data.ticketTypes });
        console.log('Ticket creation response:', ticketResponse);
      }

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

  const handleTicketTypeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTicketTypes = [...formData.ticketTypes];
    updatedTicketTypes[index][name] = value;
    setFormData({ ...formData, ticketTypes: updatedTicketTypes });
  };

  const addTicketType = () => {
    setFormData((prevState) => ({
      ...prevState,
      ticketTypes: [...prevState.ticketTypes, { name: '', description: '', price: '', quantity: '' }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submission(formData);
  };

  const handlePaidOptionChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, is_paid: value });
    setPaidSelected(value === 'True');
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
        <label className="ticket-type-label">Paid Event?</label>
        <div className="ticket-options">
          <label>
            <input
              type="radio"
              name="is_paid"
              value="False"
              checked={formData.is_paid === 'False'}
              onChange={handlePaidOptionChange}
            />
            Free
          </label>

          <label>
            <input
              type="radio"
              name="is_paid"
              value="True"
              checked={formData.is_paid === 'True'}
              onChange={handlePaidOptionChange}
            />
            Paid
          </label>
        </div>
      </div>

      {/* Ticket Types (if Paid is chosen) */}
      {paidSelected && (
        <div className="ticket-types-container">
          <h2>Ticket Types</h2>
          {formData.ticketTypes.map((ticket, index) => (
            <div key={index} className="ticket-type">
              <button type="button" className="accordion">
                Ticket Type {index + 1}
              </button>
              <div className="panel">
                <label>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={ticket.name}
                    onChange={(e) => handleTicketTypeChange(index, e)}
                  />
                </label>
                <label>
                  Description:
                  <input
                    type="text"
                    name="description"
                    value={ticket.description}
                    onChange={(e) => handleTicketTypeChange(index, e)}
                  />
                </label>
                <label>
                  Price:
                  <input
                    type="number"
                    name="price"
                    value={ticket.price}
                    onChange={(e) => handleTicketTypeChange(index, e)}
                  />
                </label>
                <label>
                  Quantity:
                  <input
                    type="number"
                    name="quantity"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketTypeChange(index, e)}
                  />
                </label>
                
              </div>
            </div>
          ))}
          <button type="button" onClick={addTicketType}>
            Add Ticket Type
          </button>
        </div>
      )}

      <div className="form-footer">
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default CreateEvent;
