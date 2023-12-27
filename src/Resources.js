import React, { useState, useEffect } from 'react';
import './Styles/Overview.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './Styles/Devices.css';
import './Styles/Analytics.css';
import './Styles/Dashboard.css'
import electricityIcon from './Assets/electricity-icon.png';
import waterIcon from './Assets/water-icon.png';
import heatIcon from './Assets/heat-icon.png';
import arrowIcon from './Assets/arrow-icon.png';
import ElectricityControls from './ResourcesControls/ElectricityControls';

const Resources = ({selectedResource, setSelectedResource}) => {

    const handleOptionClick = (option) => {
        setSelectedResource(option);
    };
    const handleDevicesClick = () => {
        setSelectedResource(null);
      };
    return (
      <div className="device-container dashboard-container">
        <div className="dashboard-items">
          {selectedResource=== null ? (
            <>
              <button className="dashboard-item" onClick={() => handleOptionClick('Electricity')}>
                <h2>Electricity Controls</h2>
                <img src={electricityIcon} alt="Icon" />
              </button>
              <button className="dashboard-item" onClick={() => handleOptionClick('Water')}>
                <h2>Water Controls</h2>
                <img src={waterIcon} alt="Icon" />
              </button>
              <button className="dashboard-item" onClick={() => handleOptionClick('Heat')}>
                <h2>Heat Controls</h2>
                <img src={heatIcon} alt="Icon" />
              </button>
            </>
          ) : (
            <div>
              { <ElectricityControls selectedResource={selectedResource}/>}
            </div>
          )}
          {selectedResource !== null && (
          <button className="back-button" onClick={handleDevicesClick}>
            <img src={arrowIcon} alt="Icon" />
          </button>
        )}
        </div>
      </div>
    );
  };
  
  export default Resources;