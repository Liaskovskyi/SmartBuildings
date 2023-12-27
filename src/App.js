
import React, { useState, useEffect  } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Menu';
import Overview from './Overview';
import Login from './Login'
import { Navigate } from 'react-router-dom';
import './Styles/App.css'
import Devices from './Devices';
import NewDevice from './NewDevice';
import Analytics from './Analytics';
import AdminDashboard from './AdminDashboard';
import Resources from './Resources';

const initialAuthenticated = localStorage.getItem('authenticated') ;


const App = () => {
  const [authenticated, setAuthenticated] = useState(JSON.parse(initialAuthenticated).authenticated);
  const apartmentId = localStorage.getItem('apartmentNumber');
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentTab, setCurrentTab] = useState('Overview');
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const [selectedTab, setSelectedTab] = useState('Overview'); 
  const [isAdmin, setIsAdmin] = useState(JSON.parse(initialAuthenticated).isAdmin); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);

  const resetSelectedDeviceType = () => {
    console.log("setSelectedDeviceType")
    setSelectedDeviceType(null);
  };
  const resetSelectedOption = () => {
    console.log("setSelectedOption")
    setSelectedOption(null);
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
      setCurrentDate(`${now.toLocaleDateString()}`);
    };
  

    updateCurrentTime();
  
    const interval = setInterval(updateCurrentTime, 10000);
  
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const storedAuth = localStorage.getItem('authenticated');
    
    if (storedAuth==true) {
      setAuthenticated(JSON.parse(storedAuth));
      setIsAdmin(JSON.parse(storedAuth).isAdmin);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('authenticated', JSON.stringify({ authenticated, isAdmin }));
  }, [authenticated, setIsAdmin]);
  return (
    <Router>
      <div className="app-container">
        {authenticated && <Menu setAuthenticated={setAuthenticated} setCurrentTab={setCurrentTab} resetSelectedDeviceType={resetSelectedDeviceType}
         selectedTab={selectedTab} setSelectedTab={setSelectedTab} isAdmin = {isAdmin} setAdmin={setIsAdmin} selectedOption={selectedOption} setSelectedOption={setSelectedOption} resetSelectedOption={resetSelectedOption}/>}
        <div className="content-container">
          {authenticated && (
            <div className="page-info">
              <h2 className="time">{currentTime}</h2>
              <div className="row2">
                <h2 className="tab-name">{currentTab}</h2>
                <h2 className="date">{currentDate}</h2>
              </div>
            </div>
          )}
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            {authenticated ? (
              <>
                {isAdmin ? (
                  <>
                    <Route path="/login" element={<Navigate to="/admin/admin-dashboard" />} />
                    <Route path="/admin" element={<Navigate to="/admin/admin-dashboard" />} />
                    <Route path="/admin/admin-dashboard" element={<AdminDashboard selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>} />
                    <Route path="/admin/resources" element={<Resources selectedResource={selectedResource} setSelectedResource={setSelectedResource}/> } />
                  </>
                ) : (
                  <>
                    <Route path="/apartment/:id/overview" element={<Overview selectedDeviceType={selectedDeviceType} setSelectedDeviceType={setSelectedDeviceType} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />} />
                    <Route path="/apartment/:id/devices/*" element={<Devices selectedDeviceType={selectedDeviceType} setSelectedDeviceType={setSelectedDeviceType} />} />
                    <Route path="/apartment/:id/analytics" element={<Analytics />} />
                    <Route path="/apartment/:id/devices/add-device" element={<NewDevice />} />
                    <Route path="/login" element={<Navigate to="/apartment/:id/overview" />} />
                  </>
                )}
              </>
            ) : (
              <Route path="/login" element={<Login setAuthenticated={setAuthenticated} setAdmin={setIsAdmin}/>} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
