import React, { useState, useEffect } from 'react';
import './Styles/Overview.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './Styles/Devices.css';
import lightIcon from './Assets/light-icon.png';
import securityIcon from './Assets/security-icon.png';
import temperatureIcon from './Assets/temperature-icon.png';
import customIcon from './Assets/custom-icon.png';
import addremoveIcon from './Assets/addremove-icon.png';
import arrowIcon from './Assets/arrow-icon.png';
import electricityIcon from './Assets/electricity-icon.png';
import waterIcon from './Assets/water-icon.png';

const Devices = ({selectedDeviceType, setSelectedDeviceType}) => {
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();
  const storedApartmentNumber = localStorage.getItem('apartmentNumber');

  useEffect(() => {
    if (storedApartmentNumber && id !== storedApartmentNumber) {
      navigate(`/apartment/${storedApartmentNumber}/devices`);
    }
  }, [id, storedApartmentNumber, navigate]);

  useEffect(() => {
    const getDevicesTypes = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/getdevicetypes/${storedApartmentNumber}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setDeviceTypes(data);
        }
      } catch (error) {
        console.error('Error fetching device types:', error);
      }
    };

    getDevicesTypes();
  }, [storedApartmentNumber]);

  const getDevices = async () => {
    if (selectedDeviceType !== null) {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/getdevices/${storedApartmentNumber}/${selectedDeviceType}`);
        if (response.ok) {
          const data = await response.json();
           setDevices(data);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      
    } finally {
      
        setLoading(false); 

    }
    }
  };

  useEffect(() => {
    getDevices();
  }, [selectedDeviceType, storedApartmentNumber]);

  const toggleLight = async (deviceId) => {
    try {
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/togglelight/${deviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data)
      } 
    } catch (error) {
      console.error('Error toggling light:', error);
    }
  };

  const deviceTypeIcons = {
    Light: lightIcon,
    'Security Device': securityIcon,
    Thermostat: temperatureIcon,
    Electricity: electricityIcon,
    Water: waterIcon
  };

  const handleDeviceTypeClick = (deviceType) => {
    setLoading(true); 
    console.log(`Clicked on ${deviceType}`);
    setSelectedDeviceType(deviceType);
    navigate(`/apartment/${storedApartmentNumber}/devices/${deviceType}`);
  };

  const handleAddDeviceClick = () => {
    console.log('Clicked on Add New Device');
    navigate(`/apartment/${storedApartmentNumber}/devices/add-device`);
  };

  const handleDevicesClick = () => {
    setSelectedDeviceType(null);
    navigate(`/apartment/${storedApartmentNumber}/devices`);
  };

  const handleToggle = async (deviceid) => {
    console.log("toggled", deviceid)
    await toggleLight(deviceid)
    await getDevices()
  };

  const handleTemperatureChange = async (deviceId, temperature) => {
    try {
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/settemperature/${deviceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ temperature }),
      });
      console.log(JSON.stringify({ temperature }))
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error('Error setting temperature:', error);
    }
    finally{
      await getDevices()
    }
  };

  return (
    <div className="device-container">
      <div className="device-items">
        {selectedDeviceType === null ? (
          deviceTypes.map((deviceType, index) => (
            <button className="device-item" key={index} onClick={() => handleDeviceTypeClick(deviceType)}>
              <img src={deviceTypeIcons[deviceType] || customIcon} alt="Icon" />
              <h2>{deviceType}</h2>
            </button>
          ))
        ) : (
          devices.map((device, index) => (
            <button className="device-item device-element" key={index}>
              <img src={deviceTypeIcons[device.deviceType] || customIcon} alt="Icon" />
              <h2 className="room-name">{device.roomName}</h2>
              {device.deviceType === 'Thermostat' ? (
                <div>
                <span className="temperature-display">{device.temperature}</span>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={device.temperature || 10} 
                    onChange={(e) => handleTemperatureChange(device.id, e.target.value)}
                    className="sliderr"
                  />
                </div>
              ) : (
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={device.status}
                    onChange={() => handleToggle(device.id)} 
                  />
                  <span className="slider"></span>
                </label>
              )}
            </button>
          ))
          
        )}
        <button className="device-item" onClick={handleAddDeviceClick}>
          <img src={addremoveIcon} alt="Icon" />
          <h2>Add or Remove Device</h2>
        </button>
        
      </div>
      {selectedDeviceType !== null && (
          <button className="back-button" onClick={handleDevicesClick}>
            <img src={arrowIcon} alt="Icon" />
          </button>
        )}
    </div>
  );
};

export default Devices;
