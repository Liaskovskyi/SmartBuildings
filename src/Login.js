import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Login.css';

const Login = ({ setAuthenticated, setAdmin }) => {
  const [loginData, setLoginData] = useState({
    Login: '',
    Password: '',
  });
  const [apartmentNumber, setApartmentNumber] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); 

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://smartbuildingsserver.azurewebsites.net/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
      console.log(loginData)
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.isAdmin==true)
        {
          setAdmin(true)
          setAuthenticated(true);
          navigate(`/admin`);
        }
        
        
        const receivedApartmentNumber = data.owner.apartments[0].apartmentID;

        localStorage.setItem('apartmentNumber', receivedApartmentNumber);
        
        setAuthenticated(true);
        navigate(`/apartment/${receivedApartmentNumber}/overview`);
        
      } else {
        console.error('Authentication failed');
        setErrorMessage('Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className="login-container">
      <h1>Log In</h1>
      <form onSubmit={handleLogin}>
        <label>
          <h2>Login:</h2>
          <input
            type="text"
            name="Login"
            value={loginData.login}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          <h2>Password:</h2>
          <input
            type="password"
            name="Password"
            value={loginData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button onClick={handleLogin}>Login</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default Login;
