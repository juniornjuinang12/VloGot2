import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfileOverview = () => {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserEmail(response.data.emailOrPhone);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div>
      <h1>Profile Overview</h1>
      <p>Email: {userEmail}</p>
      {/* Autres informations du profil */}
    </div>
  );
};

export default ProfileOverview;
