
import React, { useState, useEffect  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/Menu.css';
import { useParams } from 'react-router-dom';
import Login from './Login'
import homeIcon from './Assets/home-icon.png';

const Menu = ({setAuthenticated, setCurrentTab, resetSelectedDeviceType, selectedTab, setSelectedTab,isAdmin, setAdmin, selectedOption, setSelectedOption, resetSelectedOption}) => {
  
  const [fullName, setFullName] = useState('');

  const apartmentId = localStorage.getItem('apartmentNumber');
  
  useEffect(() => {
    if(!isAdmin){
    const getFullName = async () => {
      try {
        const response = await fetch(`https://smartbuildingsserver.azurewebsites.net/apartment/GetFullName/${apartmentId}`);
        if (response.ok) {
          const data = await response.json();

          setFullName(data.value); 
        }
      } catch (error) {
        console.error('Error fetching apartment data:', error);
      }
    };

    getFullName();
  }})
 

  const navigate = useNavigate();

  const navigateTo = (path, tab) => {
    setSelectedTab(tab);
    setCurrentTab(tab);
    console.log(selectedTab)
    if (tab === 'Devices') {
      console.log("resetSelectedDeviceType")
      resetSelectedDeviceType(); 
    }
    if(isAdmin){
      if (tab === 'Admin Dashboard') {
        console.log("resetSelectedOption")
        resetSelectedOption(); 
      }
      navigate(`/admin${path}`);
    }
    else navigate(`/apartment/${apartmentId}${path}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('apartmentNumber');
    setAuthenticated(false);
    setAdmin(false);
    console.log("loging out...")
    navigate('/login');
  };

  return (
    <div className="menu-panel">
      <div className="website-name">
        <h1>Smart Buildings</h1>
        {isAdmin&& <h2 style={{textAlign:"center"}}>Admin</h2>}
      </div>

      <div className="user-box">
        {!isAdmin? (
        <img src={homeIcon} alt="Home Icon" onClick={() => navigateTo('/overview', 'Overview')} />
        ):(
          <img src={homeIcon} alt="Home Icon" onClick={() => navigateTo('/admin-dashboard', 'Admin Dashboard')} />
        )}
        <div className="user-info">
          {!isAdmin && 
          <>
          <div style={{ color: '#9ba4ad', fontSize: '30px' }}>{fullName}</div>
          <p>Apartment #{apartmentId}</p> </>
}
        </div>
      </div>

      <div className="menu-items">
      {isAdmin ? (
          <>
            <div
              className={`menu-item ${selectedTab === 'Admin Dashboard' ? 'selected' : ''}`}
              onClick={() => navigateTo('/admin-dashboard', 'Admin Dashboard')}>
              Admin Dashboard
            </div>
            <div
              className={`menu-item ${selectedTab === 'Resources' ? 'selected' : ''}`}
              onClick={() => navigateTo('/resources', 'Resources')}>
              Resources
            </div>
          </>
        ):(
          <>
        <div
          className={`menu-item ${selectedTab === 'Overview' ? 'selected' : ''}`}
          onClick={() => navigateTo('/overview', 'Overview')}>
          Overview
        </div>
        <div
          className={`menu-item ${selectedTab === 'Devices' ? 'selected' : ''}`}
          onClick={() => navigateTo('/devices', 'Devices')}>
          Devices
        </div>
        <div
          className={`menu-item ${selectedTab === 'Analytics' ? 'selected' : ''}`}
          onClick={() => navigateTo('/analytics', 'Analytics')}>
          Analytics
        </div>
        </>
        )}

        

        <div className="logout-button" onClick={handleLogout}>
          Log out
        </div>
      </div>
    </div>
  );
};

export default Menu;
