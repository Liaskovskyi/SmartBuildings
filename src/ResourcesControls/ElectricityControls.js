import React, { useState, useEffect } from 'react';
import '../Styles/ResourcesControls.css';
import buildingIcon from '../Assets/building-icon.png';
import entranceIcon from '../Assets/entrance-icon.png';
import apartmentIcon from '../Assets/apartment-icon.png';

const ElectricityControls = ({selectedResource}) => {
  const [entranceIds, setEntranceIds] = useState([]);
  const [apartmentIds, setApartmentIds] = useState([])
  const [buildingStatus, setBuildingStatus] = useState(false);
  const [entranceStatus, setEntranceStatus] = useState(false);
  const [apartmentStatus, setApartmentStatus] = useState(false);
  const [entrances, setEntrances] = useState(false);
  const [apartments, setApartments] = useState(false);
  const [selectedEntrance, setSelectedEntrance] = useState('');
  const [selectedApartment, setSelectedApartment] = useState('');

  const getEntrances = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/apartment/getentrances`);
        if (response.ok) {
          const data = await response.json();
           setEntranceIds(data);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      
    } 

  };

  const getApartments = async () => {
    try {
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/apartment/getapartments`);
      if (response.ok) {
        const data = await response.json();
         setApartmentIds(data);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    
  } 

};

  useEffect(() => {
    getEntrances();
    getApartments()
  }, []);

  const GetBuildingStatus = async () => {
    try {
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/GetBuildingStatus/${selectedResource}`);
      if (response.ok) {
        const data = await response.json();
        setBuildingStatus(data)
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    
  } }

  const GetEntranceStatus = async () => {
    try {
        if(selectedResource=='Heat') return
        if(selectedEntrance!=''){
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/GetEntranceStatus/${selectedResource}/${selectedEntrance}`);
      if (response.ok) {
        const data = await response.json();
        setEntranceStatus(data)
      }
    }
    } catch (error) {
      console.error('Error fetching devices:', error);
    
  } }

  const GetApartmentStatus = async () => {
    try {
        if(selectedResource=='Heat') return
        if(selectedApartment!=''){
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/GetApartmentStatus/${selectedResource}/${selectedApartment}`);
      if (response.ok) {
        const data = await response.json();
        setApartmentStatus(data)
      }
    }
    } catch (error) {
      console.error('Error fetching devices:', error);
    
  } }

  useEffect(() => {
    GetBuildingStatus()
    GetEntranceStatus()
    GetApartmentStatus()
  }, []);

  const toggleBuilding = async () => {
    try {
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/toggleBuilding/${selectedResource}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();


      }
    } catch (error) {
      console.error('Error fetching devices:', error);
    
  } 
}

const toggleEntrance = async () => {
    if(selectedResource=="Heat"){
        setEntranceStatus(!entranceStatus)
        return}
    try {
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/toggleEntrance/${selectedResource}/${selectedEntrance}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();


      }
    } catch (error) {
      console.error('Error toggling an entrance:', error);
    
  } 
}

const toggleApartment = async () => {
    if(selectedResource=="Heat"){
        setApartmentStatus(!apartmentStatus)
        return}
    try {
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/toggleApartment/${selectedResource}/${selectedApartment}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
      }
    } catch (error) {
      console.error('Error toggling an entrance:', error);
    
  } 
}

const handleEntranceInput = (event) => {
    setSelectedEntrance(event.target.value)
}
useEffect(() => {
    GetEntranceStatus();
  }, [selectedEntrance]);

  useEffect(() => {
    GetApartmentStatus();
  }, [selectedApartment]);

  const handleBuildingToggle =async () => {
    await toggleBuilding()
    await GetBuildingStatus()
    };
  

  const handleEntranceToggle = async () => {
    await toggleEntrance()
    await GetEntranceStatus()
  };

  const handleApartmentToggle = async() => {
    await toggleApartment()
    await GetApartmentStatus()
  };

  return (
    <div>
      <h2>{selectedResource} Control</h2>
      <div className='control-items'>
      <div className="control-item">
        <h2>Whole Building</h2>
        <img src={buildingIcon} alt="Icon" style={{marginBottom:"100px"}}/>
        <label className="switch">
          <input
            type="checkbox"
            checked={buildingStatus}
            onChange={handleBuildingToggle}
          />
          <span className="slider"></span>
        </label>
      </div>

      
      <div className="control-item">
        <h2>By Entrance</h2>
        <img src={entranceIcon} alt="Icon" />
        <label>
        <input 
            className='input-list'
            type="text"
            value={selectedEntrance}
            onChange={handleEntranceInput}
            list="entranceIds"
            placeholder="Choose entrance"
          />  
          <datalist id="entranceIds">
            {entranceIds.map((entrance) => (
              <option key={entrance} value={entrance} />
            ))}
          </datalist>
          </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={entranceStatus}
            onChange={handleEntranceToggle}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="control-item">
        <h2>By Apartment</h2>
        <img src={apartmentIcon} alt="Icon" />
        <label>
        <input 
            className='input-list'
            type="text"
            value={selectedApartment}
            onChange={(e) => setSelectedApartment(e.target.value)}
            list="apartmentIds"
            placeholder="Choose apartment"
          />  
          <datalist id="apartmentIds">
            {apartmentIds.map((apartment) => (
              <option key={apartment} value={apartment} />
            ))}
          </datalist>
          </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={apartmentStatus}
            onChange={handleApartmentToggle}
          />
          <span className="slider"></span>
        </label>
      </div>
      </div>
    </div>
  );
};

export default ElectricityControls;
