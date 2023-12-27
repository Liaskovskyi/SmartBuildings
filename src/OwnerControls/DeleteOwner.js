import React, { useState, useEffect } from 'react';

const DeleteOwner = ({ setSelectedOption }) => {
  const [selectedOwner, setSelectedOwner] = useState('');
  const [owners, setOwners] = useState([]);
  const [selectedOwnerId, setSelectedOwnerId]= useState(0)
  const [Message, setMessage] = useState('');

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await fetch('https://smartbuildingsserver.azurewebsites.net/apartment/getowners');
        if (response.ok) {
          const data = await response.json();
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

  const handleDelete = async () => {
    console.log(selectedOwnerId)
    try {
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/apartment/deleteowner/${selectedOwnerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage("Owner was deleted successfully")
      } else {
        setMessage("Failed to delete owner")
        console.error(`Failed to delete owner with ID ${selectedOwner}`);
      }
    } catch (error) {
      console.error('Error deleting owner:', error);
    }

  };

  const handleSelectedOwnerChange = (event) => {
    setSelectedOwner(event.target.value)
    const [ownerId] = event.target.value.split(',');
    setSelectedOwnerId(ownerId);
}

  return (
    <div className="delete-owner-form">
      <h2>Delete Owner</h2>
      <p className={`message-delete ${Message.includes('successfully') ? 'success' : 'error'}`}>
          {Message}</p>
      <label>
        Select Owner to Delete:
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
      <div className="form-buttons">
        <button type="button" onClick={handleDelete}>
          Delete Owner
        </button>
        
      </div>
    </div>
  );
};

export default DeleteOwner;
