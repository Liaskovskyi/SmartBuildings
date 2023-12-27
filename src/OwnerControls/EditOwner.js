import React, { useState, useEffect } from 'react';

const EditOwner = ({ setSelectedOption }) => {
  const[selectedOwner, setSelectedOwner] = useState('')
  const[selectedOwnerId, setSelectedOwnerId] = useState('')
  console.log("selectedId", selectedOwnerId)
  const [formData, setFormData] = useState({
    OwnerID: 0, 
    FullName: '',
    DateOfBirth: '',
    PhoneNumber: '',
  });
  
  const [owners, setOwners] = useState([]);
  const [Message, setMessage] = useState('');

  useEffect(() => {

    const fetchOwners = async () => {
      try {
        const response = await fetch('https://smartbuildingsserver.azurewebsites.net/apartment/getOwners');
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setOwners(data);
        } else {
          console.error('Failed to fetch owners');
        }
      } catch (error) {
        console.error('Error fetching owners:', error);
      }
    };

    fetchOwners();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(JSON.stringify(formData))
    const UpdateOwner = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/apartment/updateOwner`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        });
        if (response.ok) {
          const data = await response.json();
          setMessage("Owner updated successfully")
        } else {
          setMessage("Failed to update owner")
          console.error('Failed to update owner');
        }
      } catch (error) {
        console.error('Error updating owner:', error);
      }
    };

    UpdateOwner()

    console.log('Updated Owner Data:', formData);

    setFormData({
      OwnerID: 0,
      FullName: '',
      DateOfBirth: '',
      PhoneNumber: '',
    });

  };

  const handleSelectedOwnerChange = (event) => {
    setSelectedOwner(event.target.value)
    const [ownerId, name] = event.target.value.split(',');
    const ownerIdAsNumber = parseInt(ownerId, 10); 
  setSelectedOwnerId(ownerId);
  setFormData({ ...formData, OwnerID: ownerIdAsNumber })
  };

  return (
    <div className="edit-owner-form">
      <h2 > Edit Owner</h2>
      <p className={`message-update ${Message.includes('successfully') ? 'success' : 'error'}`}>
          {Message}
        </p>
        <form onSubmit={handleSubmit} className='owner-form'>
        <label>
          Select Owner:
          <input 
            className='input-list'
            type="text"
            value={selectedOwner}
            name="OwnerID"
            onChange={handleSelectedOwnerChange}
            list="owners"
            placeholder="Choose owner"
          />  
          <datalist id="owners">
            {owners.map((owner) => (
              <option key={owner.ownerID} value={`${owner.ownerID}, ${owner.fullName}`} />
            ))}
          </datalist>
        </label>
        <label>
          Full Name:
          <input
            type="text"
            name="FullName"
            value={formData.FullName}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            name="DateOfBirth"
            value={formData.DateOfBirth}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="PhoneNumber"
            value={formData.PhoneNumber}
            onChange={handleInputChange}
            required
          />
        </label>
        <div className="form-buttons">
          <button type="submit">Save Changes</button>
          
        </div>
      </form>
    </div>
  );
};

export default EditOwner;
