import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import arrowIcon from './Assets/arrow-icon.png';
import './Styles/NewDevice.css';

const NewDevice = () => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [deviceType, setDeviceType] = useState('');
  const [deviceRoom, setDeviceRoom] = useState('');
  const [existingRooms, setExistingRooms] = useState([]);
  const [deviceToRemove, setDeviceToRemove] = useState('');
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(0)
  const [addDeviceMessage, setAddDeviceMessage] = useState('');
  const [removeDeviceMessage, setRemoveDeviceMessage] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();
  const storedApartmentNumber = localStorage.getItem('apartmentNumber');

  useEffect(() => {
    if (storedApartmentNumber && id !== storedApartmentNumber) {
      navigate(`/apartment/${storedApartmentNumber}/devices`);
    }
  }, [id, storedApartmentNumber, navigate]);

  useEffect(() => {
    const getDeviceTypes = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/getdevicetypes/${storedApartmentNumber}`);
        if (response.ok) {
          const data = await response.json();
          setDeviceTypes(data);
        }
      } catch (error) {
        console.error('Error fetching device types:', error);
      }
    };

    getDeviceTypes();

    const getRooms = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/getrooms/${storedApartmentNumber}`);
        if (response.ok) {
          const data = await response.json();
          setExistingRooms(data);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    getRooms();
  
    const getDevices = async () => {
        try {
          const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/getdevices/${storedApartmentNumber}`);
          if (response.ok) {
            const data = await response.json();
            setDevices(data);
          }
        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      };
  
      getDevices();
    }, [ addDeviceMessage]);
  const handleDeviceTypeChange = (event) => {
    setDeviceType(event.target.value);
  };

  const handleDeviceRoomChange = (event) => {
    setDeviceRoom(event.target.value);
  };

  const handleAddDevice = async () => {
    if(deviceType && deviceRoom !==null){
        try {
          const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/adddevice/${storedApartmentNumber}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deviceType, roomName: deviceRoom }),
          });
          if (response.ok) {
            const data = await response.json();
           
            setAddDeviceMessage('Device added successfully');
            
          } 
        } catch (error) {
          console.error('Error adding new device:', error);
          setAddDeviceMessage('Error adding device');
        }
      
       
    }
  };

  const handleDeviceToRemoveChange = (event) => {
    const [deviceR, DevId] = event.target.value.split(',');
  setDeviceToRemove(deviceR);
  setDeviceId(DevId)
  };

  const handleRemoveDevice = async () => {
    if(deviceToRemove!==null){
        try {
          const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/removedevice/${storedApartmentNumber}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body:  deviceId ,
          });
          if (response.ok) {
            const data = await response.json();
           
            setRemoveDeviceMessage('Device removed successfully');

          } 
        } catch (error) {
          console.error('Error adding new device:', error);
          setRemoveDeviceMessage('Error removing device');
        }
      
        
    }
  };

  const handleBackClick = () => {
    navigate(`/apartment/${storedApartmentNumber}/devices`);
  };
  
  return (
    <div className="device-container">
        <div className="add-device">
      <h2 className='function-name'>Add New Device</h2>
      <form>
        <label>
          Device Type:
          <input 
            className='input-list'
            type="text"
            value={deviceType}
            onChange={handleDeviceTypeChange}
            list="deviceTypes"
            placeholder="Choose device type"
          />
          <datalist id="deviceTypes">
            {deviceTypes.map((type) => (
              <option key={type} value={type} />
            ))}
          </datalist>
        </label>
        <br />
        <label>
          Device Room:
          <input
          className='input-list'
            type="text"
            value={deviceRoom}
            onChange={handleDeviceRoomChange}
            list="existingRooms"
            placeholder="Choose room"
          />
          <datalist id="existingRooms">
            {existingRooms.map((room) => (
              <option key={room} value={room} />
            ))}
          </datalist>
        </label>
        <br />
        <button type="button" className='add-remove-button' onClick={handleAddDevice}>
          Add Device
        </button>
      </form>
      <h2 className={`message ${addDeviceMessage.includes('successfully') ? 'success' : 'error'}`}>
          {addDeviceMessage}
        </h2>
      </div>
      <button className="back-button" onClick={handleBackClick}>
            <img src={arrowIcon} alt="Icon" />
          </button>

     <div className="remove-device">
        <h2 className='function-name'>Remove Device</h2>
        <form>
          <label className='input-list-remove'>
            Device to Remove:
            <input
              className='input-list'
              type="text"
              value={deviceToRemove}
              onChange={handleDeviceToRemoveChange}
              list="devicesToRemove"
              placeholder="Choose device to remove"
            />
            <datalist id="devicesToRemove">
              {devices.map((device) => (
                <option key={device.id} value={` ${device.deviceType} - ${device.roomName}, ${device.id}`} />
              ))}
            </datalist>
          </label>
          <br />
          <button type="button" className='add-remove-button' onClick={handleRemoveDevice}>
            Remove Device
          </button>
        </form>
        <h2 className={`message ${removeDeviceMessage.includes('successfully') ? 'success' : 'error'}`}>
          {removeDeviceMessage}
        </h2>      </div>

      <button className="back-button" onClick={handleBackClick}>
        <img src={arrowIcon} alt="Icon" />
      </button>
    </div>
    
    
  );
};

export default NewDevice;
