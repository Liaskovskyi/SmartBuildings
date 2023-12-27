import React, { useState, useEffect } from 'react';
import './Styles/Overview.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './Styles/Devices.css';
import './Styles/Analytics.css';
import './Styles/Dashboard.css'
import addNewIcon from './Assets/addnew-icon.png';
import editIcon from './Assets/edit-icon.png';
import deleteIcon from './Assets/delete-icon.png';
import AddNewOwner from './OwnerControls/AddNewOwner';
import EditOwner from './OwnerControls/EditOwner';
import DeleteOwner from './OwnerControls/DeleteOwner';
import arrowIcon from './Assets/arrow-icon.png';

const AdminDashboard = ({selectedOption, setSelectedOption}) => {
    console.log(selectedOption)

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };
    const handleDevicesClick = () => {
        setSelectedOption(null);
      };
    return (
      <div className="device-container dashboard-container">
        <div className="dashboard-items">
          {selectedOption=== null ? (
            <>
              <button className="dashboard-item" onClick={() => handleOptionClick('addNew')}>
                <h2>Add new owner</h2>
                <img src={addNewIcon} alt="Icon" />
              </button>
              <button className="dashboard-item" onClick={() => handleOptionClick('edit')}>
                <h2>Edit owner</h2>
                <img src={editIcon} alt="Icon" />
              </button>
              <button className="dashboard-item" onClick={() => handleOptionClick('delete')}>
                <h2>Delete owner</h2>
                <img src={deleteIcon} alt="Icon" />
              </button>
            </>
          ) : (
            <div>
              {selectedOption === 'addNew' && <AddNewOwner selectedOption={selectedOption} setSelectedOption={setSelectedOption}/>}
              {selectedOption === 'edit' && <EditOwner />}
              {selectedOption === 'delete' && <DeleteOwner />}
            </div>
          )}
          {selectedOption !== null && (
          <button className="back-button" onClick={handleDevicesClick}>
            <img src={arrowIcon} alt="Icon" />
          </button>
        )}
        </div>
      </div>
    );
  };
  
  export default AdminDashboard;