import React, { useState, useEffect } from 'react';
import './Styles/Overview.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './Styles/Devices.css';
import './Styles/Analytics.css';
import electricityIcon from './Assets/electricity-icon.png';
import waterIcon from './Assets/water-icon.png';
import heatIcon from './Assets/heat-icon.png';

const Analytics = ({selectedDeviceType, setSelectedDeviceType}) => {

    const [electricityData, setElectricityData] = useState({});
    const [waterData, setWaterData] = useState({});
    const [heatData, setHeatData] = useState({});

  const navigate = useNavigate();
  const { id } = useParams(); 
  const storedApartmentNumber = localStorage.getItem('apartmentNumber');

  

  useEffect(() => {
    if (storedApartmentNumber && id !== storedApartmentNumber) {
      navigate(`/apartment/${storedApartmentNumber}/overview`);
    }
  }, [id, storedApartmentNumber, navigate]);
   
  const getMeterData = async (meterType) => {
    try {
      const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/meters/getmeterdata/${storedApartmentNumber}/${meterType}`);
      if (response.ok) {
        const data = await response.json();
        switch (meterType) {
          case 'electricity':
            setElectricityData(data);
            break;
          case 'water':
            setWaterData(data);
            break;
          case 'heat':
            setHeatData(data);
            break;
          default:
         
            break;
        }
        console.log(meterType)
        console.log(electricityData)
      } else {
        console.error(`Error fetching ${meterType} meter data`);
      }
    } catch (error) {
      console.error(`Error fetching ${meterType} meter data:`, error);
    }
  };

  useEffect(() => {
    getMeterData('electricity');
    getMeterData('water');
    getMeterData('heat');
  }, []);

  const handleElectricityUpdate =  async() => {
    const getElectricity = async () => {
        try {
          const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/meters/getElectricity/${storedApartmentNumber}`);
          if (response.ok) {
            const data = await response.json();
          }
        } catch (error) {
          console.error('Error updating electricity:', error);
        }
      };
  
      await getElectricity();
      await getMeterData('electricity');
  }

  const handleWaterUpdate =  async () => {
    const getWater = async () => {
        try {
          const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/meters/getWater/${storedApartmentNumber}`);
          if (response.ok) {
            const data = await response.json();
          }
        } catch (error) {
          console.error('Error updating water:', error);
        }
      };
  
      await getWater();
      await getMeterData('water');
      
  }

  const handleHeatingUpdate =  async() => {
    const getHeating = async () => {
        try {
          const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/meters/getHeating/${storedApartmentNumber}`);
          if (response.ok) {
            const data = await response.json();
          }
        } catch (error) {
          console.error('Error updating electricity:', error);
        }
      };
  
      await getHeating();
      await getMeterData('heat');
      
  }

  const formatNumber = (number, decimalPlaces) => {
    if (number === undefined || number === null) {
      return ''; 
    }
    return number.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return ''; 
    }

    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="device-container analytics-container">
        <div className='analytics-items'>
        <div className="analytics-item">
        <h2>Electricity Meter</h2>
        <img src={electricityIcon} alt="Icon" />
          <h2>{formatNumber(electricityData.electricity, 3)} kWh / month</h2>
        <h3>Last updated:</h3>
        <h3 style={{ marginBottom: '10px' }}>{formatDate(electricityData.insertDateTime)}
</h3>
      </div>
      <div className="analytics-item">
        <h2>Water Meter</h2>
        <img src={waterIcon} alt="Icon" />
        <h2>{formatNumber(waterData.water, 3)} L / month</h2>
        <h3>Last updated:</h3>
        <h3 style={{ marginBottom: '10px' }}>{formatDate(waterData.insertDateTime)}</h3>
      </div>
      <div className="analytics-item">
        <h2>Heat Meter</h2>
        <img src={heatIcon} alt="Icon" />
          <h2>{formatNumber(heatData.heating, 3)} kWh / month</h2>
        <h3>Last updated:</h3>
        <h3 style={{ marginBottom: '10px' }}>{formatDate(heatData.insertDateTime)}</h3>
      </div>
        </div>
        <div className='analytics-items'>
            <button className='refresh-button' onClick={handleElectricityUpdate}>Get updated data</button>
            <button className='refresh-button' onClick={handleWaterUpdate}>Get updated data</button>
            <button className='refresh-button' onClick={handleHeatingUpdate}>Get updated data</button>
        </div>
    </div>
  );
};

export default Analytics;
