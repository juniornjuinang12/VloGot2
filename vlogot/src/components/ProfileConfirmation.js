
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Background = styled.div`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  position: relative;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.2rem;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 1.2rem;
`;

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const InfoColumn = styled.div`
  flex: 1;
  margin-right: ${({ right }) => (right ? '0' : '0.5rem')};
  margin-left: ${({ left }) => (left ? '0' : '0.5rem')};
  text-align: left;
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 5px;
  background: #f9f9f9;
`;

const Button = styled.button`
  padding: 0.7rem 2rem;
  font-size: 1rem;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  &:hover {
    background: #0056b3;
  }
`;

const ProfileConfirmation = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserInfo(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <div>Chargement...</div>;
  }

  return (
    <Background>
      <Card>
        <Title>Confirmation du Profil</Title>
        {userInfo.profileImage && <ProfileImage src={userInfo.profileImage} alt="Profile" />}
        <InfoContainer>
          <InfoColumn left>
            <InfoText><strong>Nom :</strong> {userInfo.lastName}</InfoText>
            <InfoText><strong>Prénom :</strong> {userInfo.firstName}</InfoText>
            <InfoText><strong>Email :</strong> {userInfo.emailOrPhone}</InfoText>
          </InfoColumn>
          <InfoColumn right>
            <InfoText><strong>Pseudo :</strong> {userInfo.username}</InfoText>
            <InfoText><strong>Date de Naissance :</strong> {`${userInfo.day}/${userInfo.month}/${userInfo.year}`}</InfoText>
            <InfoText><strong>Genre :</strong> {userInfo.gender}</InfoText>
          </InfoColumn>
        </InfoContainer>
        <Button onClick={() => navigate('/home')}>Confirmer</Button>
      </Card>
    </Background>
  );
};

export default ProfileConfirmation;
