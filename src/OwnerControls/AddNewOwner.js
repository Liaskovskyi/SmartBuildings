import React, { useState, useEffect } from 'react';
import '../Styles/Owners.css'

const AddNewOwner = ({ setSelectedOption }) => {
  const[selectedApartment, setSelectedApartment] = useState('')
  const [formData, setFormData] = useState({
    FullName: '',
    DateOfBirth: '',
    PhoneNumber: '',
  });
  const [user, setUser] = useState()
  const [availableApartments, setAvailableApartments] = useState([]);
  const [Message, setMessage] = useState('');

  useEffect(() => {
    const fetchAvailableApartments = async () => {
      try {
        const response = await fetch('https://smartbuildingsserver.azurewebsites.net/apartment/getavailableapartments');
        if (response.ok) {
          const data = await response.json();
          setAvailableApartments(data);
        } else {
          console.error('Failed to fetch available apartments');
        }
      } catch (error) {
        console.error('Error fetching available apartments:', error);
      }
    };

    fetchAvailableApartments();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const addNewOwner = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/apartment/addNewOwner/${selectedApartment}`,{
          method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FullName: formData.FullName,
          DateOfBirth: formData.DateOfBirth,
          PhoneNumber: formData.PhoneNumber,
        }),
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.newUser)
          setMessage("New owner added successfully")
        } else {
          console.error('Failed to add new owner');
          setMessage("Failed to add new owner")
        }
      } catch (error) {
        console.error('Error adding new owner:', error);
      }
    };

    addNewOwner()

    setFormData({
      FullName: '',
      DateOfBirth: '',
      PhoneNumber: '',
    });

  };

  
console.log(user)
  return (
    <div className="add-new-owner-form">
      <h2>Add New Owner</h2>
      <p className={`message-add ${Message.includes('successfully') ? 'success' : 'error'}`}>
          {Message}</p>
      <form onSubmit={handleSubmit} className='owner-form'>
      <label>
          Select Apartment:
          <input 
            className='input-list'
            type="text"
            value={selectedApartment}
            name="selectedApartment"
            onChange={(e)=>setSelectedApartment(e.target.value)}
            list="apartments"
            placeholder="Choose apartment"
          />  
          <datalist id="apartments">
            {availableApartments.map((apartment) => (
              <option key={apartment} value={apartment} />
            ))}
          </datalist>
        </label>
        <label>
          Full Name:
          <input
            type="text"
            name="FullName"
            value={formData.fullname}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            name="DateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="PhoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </label>
        
        <div className="form-buttons">
          <button type="submit">Add Owner</button>
        </div>
        {user && (
        <div className='LoginPass'> 
        <div>
          <h3>New user login:</h3>
        <div className='loginbox'>{user.login} </div>
        </div>
        <div>
        <h3>New user password:</h3>
        <div className='loginbox'>{user.password} </div>
        </div>
        </div>)}
      </form>
    </div>
  );
};

export default AddNewOwner;
