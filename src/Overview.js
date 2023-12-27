
import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './Styles/Overview.css';
import securityIcon from './Assets/security-icon.png';
import lightIcon from './Assets/light-icon.png';
import temperatureIcon from './Assets/temperature-icon.png';

const Overview = ({selectedDeviceType, setSelectedDeviceType, selectedTab, setSelectedTab}) => {
  const [securityStatus, setSecurityStatus] = useState(false)
  const [lightsOnCount, setLightsOnCount] = useState(0)
  const [avgTemperature, setAvgTemperature] = useState(0)

  const navigate = useNavigate();
  const { id } = useParams(); 
  const storedApartmentNumber = localStorage.getItem('apartmentNumber');

  useEffect(() => {
    if (storedApartmentNumber && id !== storedApartmentNumber) {
      navigate(`/apartment/${storedApartmentNumber}/overview`);
    }
  }, [id, storedApartmentNumber, navigate]);
   
  useEffect(() => {
    const getSecurityStatus = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/getsecuritystatus/${storedApartmentNumber}`);
        if (response.ok) {
          const data = await response.json();
          setSecurityStatus(data[0]); 
        }
      } catch (error) {
        console.error('Error fetching apartment data:', error);
      }
    };

    getSecurityStatus();
  })
  
  useEffect(() => {
    const getLightsOnCount = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/getlightsoncount/${storedApartmentNumber}`);
        if (response.ok) {
          const data = await response.json();
          setLightsOnCount(data); 
        }
      } catch (error) {
        console.error('Error fetching apartment data:', error);
      }
    };

    getLightsOnCount();
  })

  useEffect(() => {
    const getAvgTemperature = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/devices/getavgtemperature/${storedApartmentNumber}`);
        if (response.ok) {
          const data = await response.json();
          setAvgTemperature(data); 
        }
      } catch (error) {
        console.error('Error fetching apartment data:', error);
      }
    };

    getAvgTemperature();
  })

  const handleSecurityClick =  () => {
    setSelectedDeviceType("Security Device")
    setSelectedTab("Devices")
      navigate(`/apartment/${storedApartmentNumber}/devices/Security Device`);
  }

  const handleLightClick =  () => {
    setSelectedDeviceType("Light")
    setSelectedTab("Devices")
      navigate(`/apartment/${storedApartmentNumber}/devices/Light`);
  }

  const handleTemperatureClick =  () => {
    setSelectedDeviceType("Thermostat")
    setSelectedTab("Devices")
      navigate(`/apartment/${storedApartmentNumber}/devices/Thermostat`);
  }

  const handleAnalyticsClick =  () => {
    setSelectedTab("Analytics")
      navigate(`/apartment/${storedApartmentNumber}/analytics`);
  }

  return (
    <div className="overview-container">
      <div className="overview-items">
        <div className="overview-item security-box" onClick={ handleSecurityClick}>         
          <h2>Security is</h2>
          <img src={securityIcon} alt="SecurityIcon"/>
          
          {securityStatus ? (
          <h2 className="green-text">ON</h2>
          ) : (
            <h2 className="red-text">OFF</h2>
        )}
          
        </div>
        <div className="overview-item lights-box" onClick={handleLightClick}>
          <h2>Lights ON:</h2> 
          <img src={lightIcon} alt="LightIcon"/>
          <h2>{lightsOnCount}</h2>
        </div>
        <div className="overview-item temperature-box" onClick={handleTemperatureClick}>
          <h2>Average temperature is:</h2> 
          <img src={temperatureIcon} alt="TemperatureIcon"/>
          <h2>{avgTemperature}</h2>
        </div>
      </div>
      <button className="see-analytics-button" onClick={handleAnalyticsClick }>See Analytics  </button>
    </div>
  );
};

export default Overview;
