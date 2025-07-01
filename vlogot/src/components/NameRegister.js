import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './NameRegister.css';

const NameRegister = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleNameRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/register-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName, lastName }),
      });

      if (response.ok) {
        console.log('Name registered successfully');
        // Rediriger ou afficher un message de succès
      } else {
        console.error('Error registering name');
      }
    } catch (error) {
      console.error('Error registering name:', error);
    }
  };

  return (
    <div className="name-register-container">
      <h1 className="name-register-title">Entrez votre nom</h1>
      <form onSubmit={handleNameRegister} className="name-register-form">
        <input
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <button type="submit" className="register-button name-button">
          Suivant
        </button>
      </form>
    </div>
  );
};

export default NameRegister;
