import React, { useState, useEffect } from 'react';
import './CreateEvent.css';
import AxiosInstance from './axios';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

const CreateEvent = () => {
  const navigate = useNavigate();

  const defaultValues = {
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
    organiser:'',
    image: null,
    ticketTypes: [],
    max_limit: '',
  };

  const [formData, setFormData] = useState(defaultValues);
  const [paidSelected, setPaidSelected] = useState(false);
  const [isOrganiser, setIsOrganiser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('Bearer');
    if (token) {
      AxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Fetch user data including is_organiser field
    AxiosInstance.get(`http://127.0.0.1:8000/users/me/`)
      .then(response => {
        setIsOrganiser(response.data.is_organiser); // Assuming the is_organiser field is a boolean
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const category = ['Choose category','Art and Entertainment', 'Business and Profession', 'Fashion', 'Education', 'Theatre', 'Standup', 'Market', 'Music and Concert','Festival','Food & Drink','Others'];
  const [availableTags, setAvailableTags] = useState(['Fun', 'Dance', 'Music', 'Seminar', 'Night', 'Games', 'Food', 'Crafts', 'Zen', 'Comedy', 'Film', 'Photography', 'Tech', 'Thrift', 'Donation', 'Marathon', 'Cycling', 'Nature', 'Health', 'Pottery', 'Book','Indoor', 'Outdoor','Meet & Greet' ]);  
  const [newTag, setNewTag] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataWithoutImage = { ...formData };
      delete formDataWithoutImage.image;
  
      const formDataForImage = new FormData();
      formDataForImage.append('image', formData.image);
  
      const formattedData = {
        ...formDataWithoutImage,
        category: { name: formData.category },
        tags: formData.tags.map((tag) => ({ name: tag })),
        organiser: localStorage.getItem('id'),
        max_limit: formData.max_limit,
        ticket_types: formData.ticketTypes.map((ticket) => ({
          ...ticket,
          quantity_available: ticket.quantity,
        })),
      };
  
      const response = await AxiosInstance.post('create-event/', formattedData);
  
      if (formData.is_paid === 'True') {
        const eventId = response.data.id;
        const ticketResponse = await AxiosInstance.post(`tickets/${eventId}/create/`, { event: eventId, max_limit:formData.max_limit,ticket_types: formData.ticketTypes });
        console.log('Ticket creation response:', ticketResponse);
      }
  
      const eventId = response.data.id;
  
      await AxiosInstance.patch(`event/${eventId}/image/`, formDataForImage, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Response from backend:', response);
      navigate('/');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handlePaidOptionChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, is_paid: value });
    setPaidSelected(value === 'True');
  };
  const handleNewTagInputChange = (e) => {
    setNewTag(e.target.value);
  };

  const addNewTag = () => {
    if (newTag.trim() !== '') {
      setAvailableTags([...availableTags, newTag.trim()]);
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { // Check if the pressed key is Enter
      e.preventDefault(); // Prevent default behavior of Enter key
      addNewTag(); // Call the function to add the new tag
    }
  };
  

  return (
    <div>
    {!isOrganiser && (
     <section className="min-vh-100 d-flex flex-column justify-content-center" style={{ backgroundColor: "#ffffff" }}>
     <div className="organiser-message">
       <div className="organiser-message-text">
         <p>
           You need to be an organiser to create events. Please create an organiser account to proceed.
         </p>
       </div>
       <div className="organiser-message-button">
         <Button type="submit" onClick={() => navigate("/signup")}>
           Create Organiser Account
         </Button>
       </div>
     </div>
   </section>
   

    )}
    {isOrganiser && (
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
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input 
        type="text" 
        value={newTag} 
        onChange={handleNewTagInputChange} 
        onKeyDown={handleKeyDown}
        style={{
          padding: '6px',
          margin: '4px',
          backgroundColor: '#f2f5f8',
          color: '#060000',

          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',

          width: '100px', // Adjusted width
        }} 
        placeholder="+ Add Tag"
      />
    </div>
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

      {/* Max Limit (if Paid is chosen) */}
      {paidSelected && (
  <label>
    Max Limit:
    <input
      type="number"
      name="max_limit"
      value={formData.max_limit}
      onChange={handleInputChange}
      min={1} // Set the minimum value allowed
    />
  </label>
)}

      {/* Ticket Types (if Paid is chosen) */}
      {paidSelected && (
        <div className="ticket-types-container">
          <h4>Add Ticket Types</h4>
          {formData.ticketTypes.map((ticket, index) => (
            <div key={index} className="ticket-type ">
              <button type="button" className="accordion">
                Ticket Type {index + 1}
              </button>
              <div className="panel mt-4">
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
        <Button type="submit">Submit</Button>
      </div>
    </form>
      )}
      </div>
    );
  };

export default CreateEvent;
