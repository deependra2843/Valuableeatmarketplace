import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {


     
       
      const response = await fetch('/logout', {
        method: 'GET',
        credentials: 'include', // include cookies in the request
      });

      console.log('Response:', response);

      if (response.ok) {
        // Navigate to the home page after successful logout
        navigate('/');
        console.log('Logged out successfully');
      } else {
        // Handle error response from server
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
