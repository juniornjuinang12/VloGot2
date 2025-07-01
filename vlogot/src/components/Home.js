import React, { useEffect, useState, useRef } from 'react';
import styles from './Home.module.css'; // Import du module CSS
import styled, { keyframes ,css } from 'styled-components';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import { FaExpand } from 'react-icons/fa'; // Importer l'icône d'agrandissement
import { useNavigate } from 'react-router-dom'; // Importer useNavigate pour la navigation
import Vibrant from 'node-vibrant/lib/bundle';
import TooltipWithImage from './TooltipWithImage';
import { ToastContainer ,toast ,Slide} from 'react-toastify';
import './toastStyles.css';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome, FaTrash,FaQuestionCircle, FaChevronUp,FaPalette,FaLock , FaUndo, FaRedo, FaChevronDown, FaArrowLeft, FaShare, FaEnvelope, FaPlus, FaCheck, FaCog, FaCamera, FaMusic, FaFileAlt, FaVideo, FaFilm, FaFilePdf, FaMicrophone, FaExpandAlt,FaImage, FaHeadphones, FaHeart, FaComment } from 'react-icons/fa';
let toastId = null;


const BackArrow = styled(FaArrowLeft)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  z-index: 2;
`;

const HomeContainer = styled.div`
  background-color: #f4f4f4;
  height: 100vh;
  box-sizing: border-box;
  padding-top: 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-right: 20px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 10px;
  right: 50px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px); // Décalage vertical pour un effet de glissement
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Appliquer l'animation au tooltip

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
`;

const fadeInTooltip = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px); /* Effet de glissement vers le bas */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOutTooltip = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px); /* Effet de glissement vers le haut */
  }
`;


const StyledTooltip = styled.div`
  position: absolute;
  top: -40px; /* Position du tooltip par rapport au conteneur */
  left: 247px; /* Position du tooltip par rapport au conteneur */
  width: 175px; /* Augmentation légère de la largeur */
  background: linear-gradient(145deg, #e3f2ff, #d0e1ff); /* Bleu dominant avec une touche douce */
  border: 2px solid #007bff; /* Bordure bleu intense */
  border-radius: 16px; /* Arrondi plus doux */
  padding: 8px; /* Espacement légèrement ajusté */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: Arial, sans-serif;
  color: #333;
  z-index: 1000;
  font-size: 13px; /* Taille de police légèrement ajustée */

  /* Ajout de l'animation */
  animation: ${({ isExiting }) => (isExiting ? fadeOutTooltip : fadeInTooltip)} 0.5s ease-out forwards;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #007bff transparent transparent transparent; /* Pointe de flèche assortie */
  }
`;

const TooltipContent = styled.p`
  font-size: 13px; /* Taille de police légèrement ajustée */
  color: #333;
  margin: 4px 0;
  line-height: 1.3;
`;








const TooltipButton = styled.button`
  background: linear-gradient(90deg, #007bff, #0056b3);
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-size: 12px;
  margin-top: 4px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #0056b3, #003f7f);
    transform: scale(1.03);
  }
`;








const ProfileImage = styled.img`
  border-radius: 50%;
  width: 36px;
  height: 36px;
  object-fit: cover;
  margin-right: 8px;
`;

const Username = styled.span`
  font-size: 0.9rem;
  color: #333;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

const MenuBar = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 0;
  background-color: #007bff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 1000;
  border-radius: 12px 12px 0 0;
`;

const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  color: ${({ active }) => (active ? '#ffdd57' : 'white')};
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;

  & > svg {
    font-size: 18px;
    margin-bottom: 3px;
  }

  &:hover {
    transform: scale(1.05);
  }
`;

const CreateButton = styled(MenuItem)`
  background-color: white;
  color: #007bff;
  border-radius: 50%;
  padding: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  position: relative;
  top: -10px;

  & > svg {
    font-size: 24px;
    margin-bottom: 0;
  }

  &:hover {
    color: #0056b3;
  }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shineAnimation = keyframes`
  0% { opacity: 0; transform: translateX(-100%); }
  50% { opacity: 1; }
  100% { opacity: 0; transform: translateX(100%); }
`;

const NextButton = styled.button`
  background-color: ${({ isCreate }) => (isCreate ? '#007bff' : '#28a745')};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 300px;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    transform: translateY(-2px);
    position: relative;
    ${({ isCreate }) =>
      isCreate &&
      css`
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          height: 100%;
          width: 100%;
          background: rgba(255, 255, 255, 0.5);
          filter: blur(2px);
          animation: ${shineAnimation} 1s ease;
        }
      `}
  }

  ${({ isCreate }) =>
    isCreate &&
    css`
      background: linear-gradient(45deg, #007bff, #6a11cb, #28a745);
      background-size: 300% 300%;
      animation: ${gradientAnimation} 3s ease infinite;
    `}
`;



const ContentSection = styled.div`
  padding: 20px;
  margin-top: 60px;
`;

const AnimatedCard = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(100%)')};
  width: 41%;
  background-color: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: transform 0.5s ease-in-out;
  z-index: 1500;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
`;

const CreateCard = styled.div`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  padding: 40px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  max-width: 150px;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  transition: transform 0.2s ease-in-out;

  &:active {
    transform: scale(0.95);
  }
`;

const MultiVlogIconBackground = styled.div`
  position: absolute;
  opacity: 0.1;
  font-size: 20px;
  color: white;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
`;

const PlusButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  cursor: pointer;
  margin-top: auto;
  z-index: 1;
  transition: transform 0.2s ease-in-out, background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    transform: scale(0.9);
  }
`;

const ConfigCard = styled.div`
  position: fixed;
  bottom: ${({ isConfigOpen }) => (isConfigOpen ? '0' : '-100%')};
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  background-color: #f4f4f4;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: bottom 0.5s ease-in-out;
  z-index: 1600;
`;

const ConfigTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
  margin-left: -430px;
`;

const VerticalLine = styled.div`
  position: absolute;
  top: -1.5px;
  left: calc(50% + 175px); /* Ajustez cette valeur pour reculer la ligne vers la droite */
  width: 2px;
  height: calc(100% + 500px); /* Ajustez la hauteur pour qu'elle atteigne le bas du card */
  background-color: #ccc;
`;

const ConfigFrame = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const ConfigSection = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;
const TrashIcon = styled(FaTrash)`
  position: absolute;
  top: 10px;  
  right: -100px; 
  font-size: 32px; 
  color: #007bff; 
  cursor: pointer;
  z-index: 3;
  
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) => (isVisible ? 'translateY(0)' : 'translateY(20px)')};
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
  
  animation: ${({ isVisible }) => (isVisible ? slideIn : slideOut)} 0.5s forwards;

  &:hover {
    transform: scale(1.2); /* Agrandit l'icône au survol */
  }
`;



const ConfigSectionLeft = styled(ConfigSection)`
  flex: 0 0 25%;
  min-height: 180px;
  padding: 20px;
  margin-left: 200px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: visible;
  animation: ${({ isVisible }) =>
    isVisible ? slideInFromLeft : slideOutToLeft} 1s forwards;
  z-index: ${({ isVisible }) => (isVisible ? 2 : 1)};
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')}; /* Ajoutez cette ligne */
`;

const sparkleAnimation = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(0.5);
    opacity: 0;
  }
`;

const fadeInEdit = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOutEdit = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const StyledTooltipEdit = styled.div`
  position: fixed;
  background: linear-gradient(145deg, #b3cde0, #e6e6fa); // Bleu et violet
  border: 2px solid #7b68ee;
  border-radius: 10px;
  padding: 8px 15px;
  width: 160px;
  top: -100px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #333;
  z-index: 9999;
  animation: ${({ isExiting }) => (isExiting ? fadeOutEdit : fadeInEdit)} 0.5s ease-out forwards;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #7b68ee transparent transparent transparent;
  }
`;

const TooltipHeaderEdit = styled.div`
  font-size: 0.9rem;
  font-weight: bold;
  color: #7b68ee;
  margin-bottom: 4px;
`;

const TooltipContentEdit = styled.p`
  font-size: 0.8rem;
  color: #333;
  margin: 6px 0;
  line-height: 1.3;
`;

const TooltipButtonEdit = styled.button`
  background: #7b68ee;
  color: white;
  padding: 4px 10px;
  border: none;
  border-radius: 16px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background: #6a5acd;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 3px; // Ajusté légèrement vers le bas
  right: 3px; // Ajusté légèrement vers la gauche
  background: transparent;
  border: none;
  color: #007bff; // Bleu par défaut
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    color: #0056b3; // Bleu plus foncé au survol
  }
`;


const Sparkle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${({ color }) => color || '#FFD700'}; /* Couleur des paillettes */
  border-radius: 50%;
  animation: ${sparkleAnimation} 1s forwards;
  pointer-events: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const subscribeSparkleLinearAnimation = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(0.5);
    opacity: 0;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px); /* Commence légèrement en dessous */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeOutDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(20px); /* Descend en disparaissant */
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;



const bounceAppearAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled-component pour le bouton "Créer" avec animation
const StyledCreateButton = styled.button`
  padding: 10px 20px; /* Légère réduction du padding */
  font-size: 17px; /* Légère réduction de la taille de la police */
  font-weight: bold;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  color: #fff;
  border: none;
  border-radius: 25px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${bounceAppearAnimation} 0.5s ease forwards;
  transform-origin: center;

  /* Centrage horizontal */
  margin-left: 310px;
  position: absolute;
  bottom: 7px;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.3);
  }
`;


const AnimatedContainer = styled.div`
  animation: ${({ isVisible }) => (isVisible ? fadeInUp : fadeOutDown)} 0.5s forwards;
`;


const SubscribeSparkleLinear = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: ${({ color }) => color || '#FFD700'};
  border-radius: 50%;
  animation: ${subscribeSparkleLinearAnimation} 1s forwards;
  pointer-events: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const ImageUploadCircle = styled.div`
  width: 80px;
  height: 80px;
  background-color: #eee;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Pour s'assurer que l'image reste à l'intérieur du cercle */
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Pour que l'image remplisse le cercle */
  }
`;

const ConfigForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
`;

const ConfigInput = styled.input`
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
`;

// Styles pour le bouton de crochet
const ToggleButton = styled.button`
  position: absolute;
  top: -30px;
  right: -200px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
  z-index: 5;
`;



const slideDown = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;


const SmallConfigCard = styled.div`
  width: auto;
  height: 30px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  bottom: 363px;  /* Ajuste cette valeur pour changer la position verticale */
  right: -165px;   /* Déplacement vers la droite en utilisant right */
  transform: translateY(-380px); /* Fait monter la carte sans affecter la droite */
  animation: ${({ isCardVisible }) => (isCardVisible ? slideDown : slideUp)} 0.5s forwards;
`;





const SmallConfigText = styled.span`
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
`;


const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  position: absolute;
  margin: -20px; /* Supprime les marges par défaut */
  padding-top: -30px; /* Ajuste l'espacement en haut si nécessaire */
  text-align: center; /* Centrer le texte */
  width: 100%; /* Pour que le titre occupe toute la largeur de la carte */
`;


const paperRollDown = keyframes`
  0% {
    height: 0;
    transform: rotateX(-90deg);
    opacity: 0;
  }
  100% {
    height: 325px;
    transform: rotateX(0);
    opacity: 1;
  }
`;

const DescriptionContainer = styled.div`
  position: absolute;
  left: 346px;
  top: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  animation: ${({ isVisible }) => (isVisible ? fadeInUp : fadeOutDown)} 0.5s forwards;
  display: ${({ shouldRender }) => (shouldRender ? 'flex' : 'none')};
`;

const CustomizationIcon = styled.div`
  position: absolute;
  top: ${({ position }) => position.y}px;
  left: ${({ position }) => position.x}px;
  font-size: 24px;
  color: #888;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
  z-index: 1000;

  &:hover {
    color: #333;
  }
`;

const TextareaContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DescriptionInput = styled.textarea`
  width: 180px;
  height: 150px;
  padding: 10px;
  padding-right: 40px; /* Pour laisser de l'espace pour l'icône */
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: none;
  font-family: Arial, sans-serif;
  color: #333;
`;

const ExpandIcon = styled(FaExpand)`
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  color: #666;
  font-size: 18px;
`;




const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 80%;
  max-width: 700px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModalCloseButton = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const OptionLabel = styled.label`
  font-weight: bold;
  margin-top: 10px;
`;

const ColorInput = styled.input`
  padding: 5px;
  width: 100%;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  height: 300px;
  font-size: ${(props) => props.fontSize || '16px'};
  font-family: ${(props) => props.fontFamily || 'Arial, sans-serif'};
  color: ${(props) => props.color || '#333'};
  background-color: ${(props) => props.bgColor || '#fff'};
  padding: 10px;
  border-radius: 8px;
  resize: none;
`;


const bounceIn = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  60% {
    transform: scale(1.05);
    opacity: 1;
  }
  80% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
`;

// Style de la carte de personnalisation
const CustomizationCard = styled.div`
  position: absolute;
  top: 40px; // Ajustez selon vos besoins
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 15px;
  animation: ${bounceIn} 0.5s ease;
  border-radius: 8px;
  z-index: 100;
  /* Autres styles si nécessaire */
`;

const CustomizationCloseButton = styled.button`
  background: none;
  border: none;
  color: #888;
  font-size: 18px;
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;


const CustomizationPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CustomizationForm = styled.input`
  padding: 8px;
  font-size: 14px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const DescriptionLabel = styled.label`
  font-size: 18px;
  font-weight: bold;
  font-style: italic;
  color: #333;
  margin-left: 18px;
  margin-top: -10px;
`;


const CardGroupContainer = styled.div`
  position: absolute;
  top: 50px;
  right: -150px;
  display: flex;
  gap: 20px; /* Espacement entre les deux cartes */
  animation: ${({ isVisible }) => (isVisible ? fadeInUp : fadeOutDown)} 0.5s forwards;
  display: ${({ shouldRender }) => (shouldRender ? 'flex' : 'none')};
`;

const NewCardContainer = styled.div`
  width: 36px;
  height: 36px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer; /* Ajoute cette ligne pour activer le curseur pointer */
`;


const SmallDoubleCard = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Centrer la petite carte */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* Assurez-vous que l'image reste à l'intérieur du conteneur */
  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* S'assurer que l'image remplit bien la carte */
  }
`;

const LeftNewCardContainer = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px; /* Ajustez cette valeur si nécessaire */
  /* Positionnement spécifique si nécessaire */
`;

const RightNewCardContainer = styled.div`
  width: 30px;  /* Ajustez la largeur selon vos besoins */
  height: 30px; /* Ajustez la hauteur selon vos besoins */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px; /* Ajustez cette valeur si nécessaire */
  /* Positionnement spécifique si nécessaire */
`;


const UndoRedoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute; /* Permet de le positionner précisément */
  top: 20px; /* Ajuste la position verticale */
  left: 320px; /* Ajuste la position horizontale pour le placer à gauche */
  transform: translate(0, -175%); /* Centre verticalement */
  z-index: 10; /* Assure que le conteneur apparaît au-dessus des autres éléments */
`;


const clickEffect = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
`;


const RightSmallCard = styled.div`
  width: 25px;
  height: 25px;
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: ${({ isDisabled }) => (isDisabled ? 'blur(2px)' : 'none')};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
&:active {
    animation: ${clickEffect} 0.2s forwards;
  }
`;

const LeftSmallCard = styled.div`
  position: relative;
  width: 25px;  /* Ajustez la largeur selon vos besoins */
  height: 25px; /* Ajustez la hauteur selon vos besoins */
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Ajustez le positionnement si nécessaire */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
&:active {
    animation: ${clickEffect} 0.2s forwards;
  }
 filter: ${({ isDisabled }) => (isDisabled ? 'blur(2px)' : 'none')};
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;

// Animation pour replier la carte comme du papier
const paperRollUp = keyframes`
  0% {
    height: 325px;
    transform: rotateX(0);
    opacity: 1;
  }
  100% {
    height: 0;
    transform: rotateX(-90deg);
    opacity: 0;
  }
`;

const ExternalCard = styled.div`
  position: absolute;
  right: -200px;
  top: 0;
  width: 150px;
  height: 0; /* Hauteur initiale 0 pour l'effet de déroulement */
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transform-origin: top; /* Permet de faire pivoter la carte autour du haut */
  overflow: hidden; /* Masque le contenu pendant le déroulement */

  animation: ${({ isVisible }) => (isVisible ? paperRollDown : paperRollUp)} 0.6s forwards;
`;




const ConfigInput2Wrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const ConfigInput2 = styled.input`
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  height: 20.5px;
  font-size: 1rem;
  width: 80%;
  position: relative;
  top: 10px;
  right: center; /* Maintient la position horizontale actuelle */

  &:hover + .tooltip2,
  &:focus + .tooltip2 {
    opacity: 1;
    visibility: visible;
  }
`;

const Tooltip2 = styled.div`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
  width: max-content;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }
`;

const InputWrapper3 = styled.div`
  position: absolute;
  top: 17px; /* Maintient la position verticale actuelle */
  right: center; /* Maintient la position horizontale actuelle */
  display: flex;
  align-items: center;
  width: 56.4%; /* Largeur du conteneur */
`;

const ConfigInput3 = styled.input`
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%; /* Rempli toute la largeur du conteneur parent */
`;


const InputIcon3 = styled.div`
  position: absolute;
  right: 10px; /* Positionne l'icône à droite à l'intérieur du conteneur */
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')}; /* Contrôle la visibilité */
  cursor: pointer;
`;

const SmallCardWrapper = styled.div`
  display: flex;
  position: absolute;
  justify-content: center;
  gap: 45px;
  right: center; /* Déplace les cartes vers la droite */
  top: 130px; /* Ajuste cette valeur pour placer les cartes juste sous le ConfigInput3 */
  margin-top: 10px; /* Ajuste l'espace entre le ConfigInput3 et les petites cartes */
`;


const SmallCard = styled.div`
  width: 60px;
  height: 60px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative; /* Position relative pour positionner l'image et l'icône */
  overflow: hidden;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05); /* Agrandit légèrement la carte au survol */
  }

  img {
    position: absolute; /* Positionne l'image en dessous de l'icône */
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1; /* Place l'image en dessous de l'icône */
  }
`;

const CameraIcon = styled(FaCamera)`
  font-size: 24px;
  color: #007bff; /* Couleur de l'icône de la caméra */
  z-index: 2; /* Place l'icône au-dessus de l'image */
  position: relative; /* Garder sa position relative pour être sur le dessus */
`;


const HiddenSelect = styled.select`
  opacity: 0; /* Rend l'élément invisible */
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const SliderContainer = styled.div`
  left: 30%; /* Ajustez cette valeur pour le déplacer vers la gauche */
  width: 100%; /* Ajustez la largeur selon vos besoins */
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  margin-top: 90px; /* Ajuste l'espace au-dessus du slider */
`;


const BlendSlider = styled.input`
  width: 70%; /* Ajustez la taille du slider pour qu'il tienne dans la carte ronde */
  appearance: none;
  height: 8px;
  background: #ddd;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  border-radius: 5px;
  position: absolute;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #007bff;
    border-radius: 50%;
    cursor: pointer;
  }

  &:hover {
    opacity: 1;
  }
`;


const RoundCard = styled.div`
  width: 172px; /* Largeur du rectangle */
  height: 40px; /* Hauteur du rectangle */
  background-color: #ffffff; /* Couleur de fond de la carte */
  border-radius: 20px; /* Coins légèrement arrondis */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  left: -48px; /* Ajustez cette valeur pour la position exacte vers la gauche */
  position: absolute; /* Position relative pour placer le slider à l'intérieur */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 270px; /* Ajustez cette valeur pour le faire descendre */
`;

const UploadButton = styled.label`
  background-color: ${({ isModified }) => 
    isModified ? '#003366' : '#007bff'}; /* Bleu foncé pour "Modifier la photo", bleu clair pour "Ajouter une photo" */
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
  text-align: center;

  &:hover {
    background-color: ${({ isModified }) => 
      isModified ? '#002244' : '#0056b3'}; /* Teinte plus foncée au survol */
  }

  input {
    display: none;
  }
`;

const CloseButtonBottom = styled.button`
  background-color: #007bff; /* Bleu */
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  /* Ajoutez cette ligne pour reculer le bouton vers la droite */
  margin-left: 214px;

  &:hover {
    background-color: #dc3545;
  }
`;

const CloseIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
`;

const ConfigSectionRight = styled(ConfigSection)`
  width: 20%;
  height: 360px;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 65px;
  margin: auto 0;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  z-index: 10;
`;

const ConfigImagePreview = styled.div`
  width: 100%;
  height: 100%;
  background-color: #eee;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  position: relative;
`;

const PreviewCard = styled.div`
  background: ${({ backgroundImage, selectedColor }) => 
    backgroundImage ? 
    `url(${backgroundImage})` : 
    (selectedColor ? selectedColor : 'linear-gradient(135deg, #6a11cb, #2575fc)')};
  background-size: cover;
  background-position: center;
  padding: 40px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
  text-align: center;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  max-width: 150px;
  position: relative;
  overflow: hidden;
  min-height: 200px;
  transition: transform 0.2s ease-in-out;
`;
const ProfileImageCircle = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 23px;
  height: 23px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: ${({ isSubscribed }) => 
    isSubscribed 
      ? '0 0 0 4px #87CEEB, 0 0 0 8px #ffffff' 
      : '0 0 0 4px rgba(0, 0, 0, 0.1), 0 0 0 8px #ffffff'}; /* Bleu si abonné, sinon noir semi-transparent */
  overflow: hidden;
  z-index: 2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;



const VlogText = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  padding-top: 0;
  padding-bottom: 20px;
  z-index: 1;
`;


const PreviewVlogText = styled.p`
  font-size: 0.9rem; /* Réduit la taille du texte */
  font-weight: bold;
  margin: auto 0 0 0;
  padding-bottom: 0px;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 80%; /* Ajuste la largeur du texte visible */
  
  &:hover {
    animation: marquee 10s linear infinite;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

const bounceAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
`;

const heartBurst = keyframes`
  0% {
    transform: scale(0.5) translate(-50%, -50%);
    opacity: 1;
  }
  80% {
    transform: scale(1.2) translate(-50%, -50%);
  }
  100% {
    transform: scale(0) translate(-50%, -50%);
    opacity: 0;
  }
`;

// Styled-component pour les cœurs qui sortent
const BurstHeart = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${heartBurst} 1s ease-out forwards;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  pointer-events: none;

  & > svg {
    color: #ff0000; /* Couleur rouge pour les cœurs qui sortent */
    font-size: 12px;
  }
`;
const LikeBubble = styled.div`
  position: absolute;
  bottom: 30px;
  left: 10px;
  width: 30px;
  height: 30px;
  background-color: ${({ isLiked }) => (isLiked ? '#007bff' : '#ff4081')}; /* Bulle bleue si cliquée */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 2;
  cursor: pointer;
  animation: ${({ isLiked }) => (isLiked ? bounceAnimation : 'none')} 0.5s ease; /* Animation de rebond */

  & > svg {
    color: ${({ isLiked }) => (isLiked ? '#ff69b4' : 'white')}; /* Cœur rose si cliqué */
    font-size: 16px;
  }
`;

const bubbleAnimation = keyframes`
  0% {
    transform: scale(0.5) translate(-50%, -50%);
    opacity: 1;
  }
  80% {
    transform: scale(1.2) translate(-50%, -50%);
  }
  100% {
    transform: scale(0) translate(-50%, -50%);
    opacity: 0;
  }
`;

const Bubble = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 123, 255, 0.3); /* Bulles transparentes bleues */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${bubbleAnimation} 1s ease-out forwards;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  pointer-events: none;

  & > svg {
    color: #007bff; /* Couleur du cœur */
    font-size: 12px;
  }
`;

const ShareButton = styled.div`
  position: absolute;
  top: 5px;
  left: 10px;
  width: 30px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.6);  // Bulle noire transparente
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;

  & > svg {
    color: #fff;  // Couleur blanche pour l'icône
    font-size: 18px;
  }
`;

const drawCircle = keyframes`
  0% {
    stroke-dasharray: 0 100;
  }
  100% {
    stroke-dasharray: 100 0;
  }
`;

const drawCheck = keyframes`
  0% {
    stroke-dashoffset: 16;
  }
  100% {
    stroke-dashoffset: 0;
  }
`;

const AnimatedCheck = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  svg {
    width: 23px;
    height: 23px;
  }

  .circle {
    fill: none;
    stroke: #007bff;
    stroke-width: 4;
    stroke-linecap: round;
    animation: ${drawCircle} 0.5s forwards;
  }

  .check {
    fill: none;
    stroke: white;
    stroke-width: 4;
    stroke-linecap: round;
    stroke-dasharray: 16;
    stroke-dashoffset: 16;
    animation: ${drawCheck} 0.3s 0.5s forwards; /* Commence après le cercle */
  }
`;

const SubscribeButton = styled.button`
  position: absolute;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007bff; /* Couleur bleue initiale */
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 2;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3; /* Couleur bleue plus foncée au survol */
  }

  &.clicked {
    background: none;
    border: none;
    padding: 0;
  }
`;


const StyledCard = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 2;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ imageUrl, gradient, selectedColor }) =>
      imageUrl 
        ? `url(${imageUrl})`
        : (gradient || selectedColor || 'linear-gradient(135deg, #007bff, #6a11cb)')};
    background-size: cover;
    background-position: center;
    opacity: ${({ blendValue }) => blendValue / 100}; 
    transition: background 0.3s ease-in-out, opacity 0.3s ease-in-out;
    z-index: 1;
  }
`;

// Utilisation de TextContainer pour le texte
const TextContainer = styled.div`
  font-size: ${({ textLength }) => (textLength === 6 ? '2.3rem' : '3rem')}; 
  font-weight: bold; 
  color: #fff;
  z-index: 2; /* Texte au-dessus du fond */
  text-align: center;
  white-space: normal;  // Autorise les retours à la ligne
  word-wrap: break-word;  // Forcer la coupure des mots si nécessaire
  overflow-wrap: break-word;  // Gère également la coupure des mots sur les anciens navigateurs
  display: block;  // Assure que le texte occupe toute la largeur disponible
`;


const CommentBubble = styled.div`
  position: absolute;
  bottom: 30px;
  right: 10px;
  width: 30px;
  height: 30px;
  background-color: #00aced; /* Couleur bleue pour le commentaire */
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 2;
  cursor: pointer;

  & > svg {
    color: white;
    font-size: 16px;
  }
`;

const slideInRight = keyframes`
  0% {
    transform: translateX(150%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInRightForNewCard = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInLeftForNewCard = keyframes`
  0% {
    transform: translateX(-100%); /* Commence à partir de la gauche */
    opacity: 0;
  }
  100% {
    transform: translateX(0); /* Se positionne au centre */
    opacity: 1;
  }
`;


const slideOutLeftFadeForNewCard = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const NewCard = styled.div`
  flex: 0 0 25%;
  min-height: 180px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: calc(25% + 40px);
  box-sizing: border-box;
  position: absolute;
  top: 80px;
  left: 210px;
  z-index: ${({ isVisible }) => (isVisible ? 3 : 1)};
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
  animation: ${({ isVisible, direction }) =>
    isVisible
      ? direction === 'next'
        ? slideInFromRight
        : slideInFromLeft
      : direction === 'next'
      ? slideOutToLeft
      : slideOutToRight} 1s forwards;
`;


const NewCardForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  width: 100%;
`;

const BackButton = styled.button`
  background-color: #ccc;
  color: #333;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-right: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #bbb;
  }
`;

const NextButtons = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;


const CategorySelection = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
`;
const ScrollableColorPicker = styled.div`
  max-height: 200px; /* Limite la hauteur pour activer le défilement si nécessaire */
  overflow-y: auto; /* Active le défilement vertical */
  width: 100%; /* S'assure que le conteneur prend toute la largeur disponible */
  padding-right: 10px; /* Ajoute un peu d'espace pour éviter que la scrollbar ne couvre les couleurs */
  box-sizing: border-box; /* Assure que le padding est inclus dans la largeur totale */
`;

const ColorPickerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 couleurs par ligne */
  gap: 10px;
  padding: 20px;
`;

const ColorSquare = styled.div`
  width: 50px;
  height: 50px;
  background-color: ${({ color }) => color.isTrash ? '#cccccc' : color};
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: scale(1.1);
  }
`;

const slideInAnimation = keyframes`
  0% {
    transform: translateX(150%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutToRightForNewCard = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;


const slideOutToRightOnBackForColor = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;


const slideOutToLeftOnBackForColor = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
`;



const ColorCategoryCard = styled.div`
  flex: 0 0 30%;
  min-height: 250px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) => (isVisible ? 'translateX(0)' : 'translateX(100%)')};
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: calc(30% + 50px);
  box-sizing: border-box;
  position: absolute;
  top: 80px;
  left: 180px;
`;




const ColorCategoryCard2 = styled.div`
  flex: 0 0 60%;
  min-height: 180px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.5s ease-in-out;
  transform: ${({ isVisible }) => (isVisible ? 'translateX(0)' : 'translateX(150%)')};
  opacity: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: calc(60% + 40px);
  box-sizing: border-box;
  position: absolute;
  top: 80px;
  left: 210px;
`;

// Animation pour l'apparition du conteneur radio
const slideIn = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Animation pour la disparition du conteneur radio
const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
`;

const RadioContainer = styled.div`
  position: absolute;
  top: 130px;
  right: -140px;
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #007bff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: ${({ isVisible }) => (isVisible ? slideIn : slideOut)} 0.5s forwards;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: white;

  input {
    margin-right: 10px;
    width: 20px;
    height: 20px;
  }
`;

const slideInTop = keyframes`
  0% {
    transform: translateY(-20%); /* Commence l'animation 50% au-dessus de la position finale */
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;


const slideOutLeftFade = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const slideOutToRightOnBack = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const slideInFromRight = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInFromLeft = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutToLeft = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const slideOutToRight = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const fadeInOut = keyframes`
  0% { opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
`;

const AlertToast = styled.div`
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ff0000;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  animation: ${fadeInOut} 2s forwards;
  z-index: 1000;
`;


const slideOutRight = keyframes`
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(150%);
    opacity: 0;
  }
`;

const raysAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1.5);
  }
`;

const RaysContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const Ray = styled.div`
  position: absolute;
  width: 2px;
  height: 15px;
  background-color: #007bff;
  opacity: 0;
  animation: ${raysAnimation} 1s forwards;
  transform-origin: bottom center;

  &:nth-child(1) { transform: rotate(0deg); }
  &:nth-child(2) { transform: rotate(45deg); }
  &:nth-child(3) { transform: rotate(90deg); }
  &:nth-child(4) { transform: rotate(135deg); }
  &:nth-child(5) { transform: rotate(180deg); }
  &:nth-child(6) { transform: rotate(225deg); }
  &:nth-child(7) { transform: rotate(270deg); }
  &:nth-child(8) { transform: rotate(315deg); }
`;

const TooltipText = styled.div`
  visibility: hidden;
  opacity: 0;
  width: 180px;  /* Largeur du tooltip */
  background-color: #007bff; /* Couleur de fond */
  color: #fff; /* Couleur du texte */
  text-align: center;
  border-radius: 8px;
  padding: 8px;
  position: absolute;
  bottom: 120%;  /* Place le tooltip au-dessus du titre */
  left: 50%;
  transform: translate(-50%, -10px); /* Centre horizontalement */
  transition: opacity 0.3s ease, transform 0.3s ease; /* Animation de transition */

  /* Triangle de pointe */
  &::after {
    content: '';
    position: absolute;
    top: 100%; /* Positionne en bas du tooltip */
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: #007bff transparent transparent transparent; /* Pointe triangle */
  }
`;

const RightSideCardContent = styled.div`
  width: 40%; /* Ajustez la largeur selon vos besoins */
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const slideDown1 = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp1 = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: ${({ $position }) => ($position ? $position.top + 343: 0)}px;
  left: ${({ $position }) => ($position ? $position.left + 745: 0)}px;
  background-color: white;
  border: 1px solid #007bff;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  width: 160px;
  animation: ${({ isExiting }) => (isExiting ? slideUp1 : slideDown1)} 0.3s ease forwards;

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 10px;
    border-width: 0 8px 8px 8px;
    border-style: solid;
    border-color: transparent transparent #007bff transparent;
  }
`;


const DropdownOption = styled.div`
  padding: 8px;
  color: #333;
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? '#e3f2ff' : 'white')}; // Maintient le fond pour l'option sélectionnée
  color: ${({ isSelected }) => (isSelected ? '#007bff' : '#333')}; // Couleur du texte pour l'option sélectionnée

  &:hover {
    background-color: #e3f2ff;
    color: #007bff;
  }
`;





const DropdownButton = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background-color: #f0f0f0;
  width: 100%;
  text-align: left;
  &:focus {
    outline: none;
  }
`;

const DropdownMenu = styled(motion.ul)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 5px;
  list-style: none;
  padding: 0;
  z-index: 9999;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.li`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f8f8f8;
  }
`;

const Home = () => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#333');
  const toggleModal = () => setModalOpen(!isModalOpen);
  const handleExpandClick = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
 
  const [showModal, setShowModal] = useState(false);
  const [showCustomizationCard, setShowCustomizationCard] = useState(false);
  const [fontSize, setFontSize] = useState('14px');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isCustomizationCardVisible, setIsCustomizationCardVisible] = useState(false);
  const [isCustomizationVisible, setCustomizationVisible] = useState(false);
  const [iconPosition, setIconPosition] = useState({ x: 400, y: 170 });
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontColor, setFontColor] = useState('#333');
  const [backgroundColor, setBackgroundColor] = useState('#fff');
  const [showCustomization, setShowCustomization] = useState(false);
  const previewImageSrc = require('../assets/demo4.png');
  const styledImageSrc = require('../assets/demo5.png');
  const [isTooltipPreviewCardVisible, setIsTooltipPreviewCardVisible] = useState(false);
  const [isTooltipStyledCardVisible, setIsTooltipStyledCardVisible] = useState(false);
  const [isExitingTooltipPreviewCard, setIsExitingTooltipPreviewCard] = useState(false);
  const [isExitingTooltipStyledCard, setIsExitingTooltipStyledCard] = useState(false);
  const [isBlendTooltipVisible, setIsBlendTooltipVisible] = useState(false);
  const [isExitingTooltipPreview, setIsExitingTooltipPreview] = useState(false);
  const [isExitingTooltipStyled, setIsExitingTooltipStyled] = useState(false);
  const [isTooltipPreviewVisible, setIsTooltipPreviewVisible] = useState(false);
  const [isTooltipStyledVisible, setIsTooltipStyledVisible] = useState(false);
  const triggerRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('current'); // Valeur par défaut

  
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [hasTooltipBeenShown, setHasTooltipBeenShown] = useState(
    typeof window !== 'undefined' && localStorage.getItem('hasTooltipBeenShown') === 'true'
  );

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipContent, setTooltipContent] = useState({ text: '', imageSrc: '' });
  const [isExitingCard, setIsExitingCard] = useState(false);
  const [isExitingTooltip, setIsExitingTooltip] = useState(false);
  const [isEditTooltipVisible2, setIsEditTooltipVisible2] = useState(false);
  const [isExiting2, setIsExiting2] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isExiting1, setIsExiting1] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasInteractedWithHiddenSelect, setHasInteractedWithHiddenSelect] = useState(false);
  const [shouldRenderCardGroup, setShouldRenderCardGroup] = useState(true);
  const [shouldRenderDescription, setShouldRenderDescription] = useState(true);
  const [shouldRenderAdditionalContent, setShouldRenderAdditionalContent] = useState(true);
  const [areAdditionalComponentsVisible, setAreAdditionalComponentsVisible] = useState(false);
  const [showAdditionalComponents, setShowAdditionalComponents] = useState(false);
  const [redoStack, setRedoStack] = useState([]);
  const [lastModifiedCard, setLastModifiedCard] = useState(null);
  const [previewImageHistory, setPreviewImageHistory] = useState([]);
  const tooltipRef = useRef(null);
  const tooltipRef2 = useRef(null);
  const editInputRef = useRef(null);
  const editInputRef2 = useRef(null);
  const hiddenSelectRef = useRef(null);
  const tooltipRef3 = useRef(null);
  const [editTooltipPosition2, setEditTooltipPosition2] = useState({ top: 0, left: 0 });
  const [isEditTooltipVisible, setIsEditTooltipVisible] = useState(false);
  const [editTooltipPosition, setEditTooltipPosition] = useState({ top: 0, left: 0 });
  const [styledCardImageHistory, setStyledCardImageHistory] = useState([]);
  const [vlogDescription, setVlogDescription] = useState('');
  const [isUserPositionLocked, setIsUserPositionLocked] = useState(false);
  const [isStyledCardVisibleForSmallCard1, setIsStyledCardVisibleForSmallCard1] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false); // État pour contrôler la visibilité
  const [isStyledCardVisible, setIsStyledCardVisible] = useState(false); // État pour la visibilité du StyledCard
  const [deletedStyledCardImage, setDeletedStyledCardImage] = useState(null); // Stocke temporairement l'image supprimée du StyledCard
  const [isTrashIcon2Visible, setIsTrashIcon2Visible] = useState(true); // Gérer la visibilité de la corbeille pour le StyledCard
  const [showRays, setShowRays] = useState(false); // État pour gérer l'affichage des traits
  const [sparkles, setSparkles] = useState([]);
  const [shouldRenderColorCard, setShouldRenderColorCard] = useState(false);
  const [subscribeSparkles, setSubscribeSparkles] = useState([]); // État pour les paillettes d'abonnement
  const [textPosition, setTextPosition] = useState('current');
  const [actionHistory, setActionHistory] = useState([]);
  const [anotherInputValue, setAnotherInputValue] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [imageInsertedFrom, setImageInsertedFrom] = useState(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false); // État pour gérer l'animation de sortie
  const newCardRef = useRef(null);
  const [deletedPreviewImage, setDeletedPreviewImage] = useState(null);  // Stocke temporairement l'image supprimée
  const [deletedSmallCardImage1, setDeletedSmallCardImage1] = useState(null); // Stocke l'image de la petite carte 1
  const [isTrashIcon1Visible, setIsTrashIcon1Visible] = useState(true);
  const [isConfigSectionLeftAnimationFinished, setIsConfigSectionLeftAnimationFinished] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [burstHearts, setBurstHearts] = useState([]);
  const [blendValue, setBlendValue] = useState(100); // Valeur initiale du slider
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [userSelectedPosition, setUserSelectedPosition] = useState('current');
  const [userInfo, setUserInfo] = useState(null);
  const [activeSession, setActiveSession] = useState('configsectionleft'); // Définir la session initiale
  const [bubbles, setBubbles] = useState([]);
  const [bgColor, setBgColor] = useState('');  // État pour stocker la couleur dominante extraite
  const [activeSection, setActiveSection] = useState('home');
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isPhotoInsertedInConfig, setIsPhotoInsertedInConfig] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [vlogTitle, setVlogTitle] = useState(''); // Nouvel état pour le titre du vlog
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [smallCardImage1, setSmallCardImage1] = useState(null);
  const [smallCardImage2, setSmallCardImage2] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [gradient, setGradient] = useState('linear-gradient(135deg, #007bff, #6a11cb)');  // Gradient initial
  const [isSecondCardVisible, setIsSecondCardVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isConfigSectionLeftVisible, setIsConfigSectionLeftVisible] = useState(true);
  const [isNewCardVisible, setIsNewCardVisible] = useState(false);
  const [isConfigSectionLeftAnimating, setIsConfigSectionLeftAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const [forceShowInitials, setForceShowInitials] = useState(false);
const [isCategoryCardLeaving, setIsCategoryCardLeaving] = useState(false);
const [isColorCategoryCardVisible, setIsColorCategoryCardVisible] = useState(false);
const [selectedColor, setSelectedColor] = useState(null);
const [previewImage, setPreviewImage] = useState(null);
const [styledCardImage, setStyledCardImage] = useState(null);
const [isImageInsertedFromConfigSectionLeft, setIsImageInsertedFromConfigSectionLeft] = useState(false);
const [isInPhotoSection, setIsInPhotoSection] = useState(false);
const [isTrashVisible, setIsTrashVisible] = useState(false); // État pour gérer la visibilité de l'icône de corbeille
const [titleColor, setTitleColor] = useState('#FFFFFF'); // Blanc par défaut
const [showRadioButtons, setShowRadioButtons] = useState(false);
const [showAlert, setShowAlert] = useState(false);
const [previewCardClicked, setPreviewCardClicked] = useState(false);
const [isReturning, setIsReturning] = useState(false);

const [isTooltipDismissed, setIsTooltipDismissed] = useState(
  localStorage.getItem('isTooltipDismissed') === 'true'
);
const [isTooltipDismissed2, setIsTooltipDismissed2] = useState(
  localStorage.getItem('isTooltipDismissed2') === 'true'
);
const isInputIcon3Visible = anotherInputValue !== ''; // Ou utilisez votre propre condition

const [isTooltipDismissed3, setIsTooltipDismissed3] = useState(
  localStorage.getItem('isTooltipDismissed3') === 'true'
);

const isStyledCardGone = !(
  imageInsertedFrom === 'configsectionleft' &&
  previewImage
) && (
  isStyledCardVisibleForSmallCard1 ||
  !!smallCardImage2 ||
  !previewImage ||
  imageInsertedFrom === 'newcard' ||
  (activeSession === 'configsectionleft' && !previewImage)
);

const [isCreatingNewVlog, setIsCreatingNewVlog] = useState(false);
// Condition de visibilité de InputIcon3
const shouldShowInputIcon3 = customCategory.length < 5 && anotherInputValue.length > 0;

// Dans votre composant Home, après vos useState
const shouldDisplayStyledCard = !(
  imageInsertedFrom === 'configsectionleft' && previewImage
) && (
  isStyledCardVisibleForSmallCard1 ||
  !!smallCardImage2 ||
  !previewImage ||
  imageInsertedFrom === 'newcard' ||
  (activeSession === 'configsectionleft' && !previewImage)
);

  const colors = [
    { isTrash: true }, // Corbeille pour annuler la sélection
     '#000000', '#FF5733', '#3357FF', '#33FF57', '#FF33A8', '#F333FF', '#FF3300', '#33FFF5',
  '#141414', '#FFD133', '#FF33E1', '#7A7A7A', '#00FF7F', '#FF4500', '#FFFFE0', '#9400D3',
  '#1F1F1F', '#32CD32', '#FF69B4', '#FFD700', '#FF8C00', '#4B0082', '#00CED1', '#FFFF00',
  '#282828', '#7B68EE', '#8A2BE2', '#ADFF2F', '#FF1493', '#FFC0CB', '#7FFF00', '#7CFC00',
  '#333333', '#20B2AA', '#4682B4', '#F0E68C', '#9ACD32', '#FF6347', '#00FF00', '#3CB371',
  '#3D3D3D', '#800080', '#DA70D6', '#FFA07A', '#FF7F50', '#FFA500', '#6495ED', '#DC143C',
  '#474747', '#87CEEB', '#C71585', '#00BFFF', '#FF00FF', '#FFFFF0', '#FFDEAD', '#FFE4B5',
  '#515151', '#FF00FF', '#9932CC', '#8B008B', '#FFB6C1', '#DDA0DD', '#B0E0E6', '#40E0D0',
  '#5C5C5C', '#EE82EE', '#FA8072', '#F08080', '#CD5C5C', '#DB7093', '#8B0000', '#BC8F8F',
  '#666666', '#A9A9A9', '#B8860B', '#D2691E', '#FFA500', '#FF8C00', '#FF4500', '#FF0000',
  '#707070', '#FF5733', '#4B0082', '#0000FF', '#00008B', '#1E90FF', '#87CEFA', '#4682B4',
  '#7A7A7A', '#00FFFF', '#00FA9A', '#00FF7F', '#00FF00', '#32CD32', '#ADFF2F', '#FF69B4',
  '#858585', '#556B2F', '#8B4513', '#A52A2A', '#D2B48C', '#D8BFD8', '#E6E6FA', '#FFFACD',
  '#8F8F8F', '#F5DEB3', '#FAF0E6', '#FFFAF0', '#FFF5EE', '#FFE4E1', '#FFDAB9', '#FFE4B5',
  '#999999', '#F0FFF0', '#FFF0F5', '#FFB6C1', '#FF69B4', '#FF1493', '#FF00FF', '#EE82EE',
  '#A3A3A3', '#00FF00', '#32CD32', '#228B22', '#008000', '#006400', '#7FFF00', '#7CFC00',
  '#AEAEAE', '#FF4500', '#FF6347', '#FF7F50', '#FFD700', '#FFFF00', '#FFFACD', '#FAFAD2',
  '#B8B8B8', '#E0FFFF', '#AFEEEE', '#ADD8E6', '#87CEEB', '#87CEFA', '#4682B4', '#B0C4DE',
  '#C2C2C2', '#DDA0DD', '#EE82EE', '#DA70D6', '#FF00FF', '#FF1493', '#FF69B4', '#FFB6C1',
  '#CCCCCC', '#F5F5DC', '#FDF5E6', '#F5FFFA', '#FFFAF0', '#FAEBD7', '#FAF0E6', '#FFE4C4',
  '#D6D6D6', '#F0FFF0', '#FFFFF0', '#FFFACD', '#FFF0F5', '#FFDEAD', '#F4A460', '#D2691E',
  '#E1E1E1', '#CD853F', '#8B4513', '#A52A2A', '#B22222', '#DC143C', '#FF0000', '#B22222',
  '#EBEBEB', '#F08080', '#FA8072', '#E9967A', '#FFA07A', '#FF7F50', '#FF6347', '#FF4500',
  '#F5F5F5', '#FFD700', '#FFFF00', '#FFFACD', '#FAFAD2', '#E6E6FA', '#D8BFD8', '#DDA0DD',
  '#FFFFFF', '#330000', '#660000', '#990000', '#CC0000', '#FF0000', '#FF3300', '#FF6600'
  ];

  const handleShowTooltip = (event, text, imageSrc) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({ top: rect.top - 80, left: rect.left }); // Positionnement au-dessus de l'icône
    setTooltipContent({ text, imageSrc });
    setTooltipVisible(true);
  };

  <ToastContainer
  position="top-center"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss={false}
  draggable
  pauseOnHover={false}
/>

const handleIconClick = () => {
  setShowCustomizationCard(!showCustomizationCard);
};

const navigate = useNavigate();

  const handleExpandClick1 = () => {
    navigate('/editeur-de-texte'); // Redirige vers la nouvelle page
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
  
    setVlogDescription(value);
  };

  useEffect(() => {
    if (imageInsertedFrom !== 'smallCardImage1') {
      setIsStyledCardVisibleForSmallCard1(false);
    }
  }, [imageInsertedFrom]);

  useEffect(() => {
    if (smallCardImage1 || previewImage) {
      setIsStyledCardVisibleForSmallCard1(true);
    }
  }, [smallCardImage1, previewImage]);
  

  useEffect(() => {
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };
  
    preloadImage(previewImageSrc);
    preloadImage(styledImageSrc);
  }, []);

  const handleFocus = (e) => {
    setCustomizationVisible(true);
    // Positionne l'icône au-dessus du champ de saisie
    setIconPosition({ x: e.target.offsetLeft + 200, y: e.target.offsetTop - 30 });
  };

  const handleBlur = () => {
    setCustomizationVisible(false);
  };

  const handleEditClick = () => {
    if (isCreatingNewVlog && !isTooltipDismissed) {
      if (editInputRef.current) {
        const rect = editInputRef.current.getBoundingClientRect();
        setEditTooltipPosition({
          top: rect.top - 60, // Ajustez cette valeur pour positionner le tooltip
          left: rect.left + rect.width / 2,
        });
      }
      setIsEditTooltipVisible(true); // Affiche le tooltip si les conditions sont remplies
    }
  };
  
  const handleEditClick2 = () => {
    if (isCreatingNewVlog && !isTooltipDismissed2) {
      if (editInputRef2.current) {
        const rect = editInputRef2.current.getBoundingClientRect();
        setEditTooltipPosition2({
          top: rect.top - 60, // Ajustez cette valeur pour positionner le tooltip
          left: rect.left + rect.width / 2,
        });
      }
      setIsEditTooltipVisible2(true); // Affiche le tooltip si les conditions sont remplies
    }
  };


  const handleSelect = (value) => {
    setTextPosition(value);
    if (value === 'bottom' && !tooltipDismissed) {
      setTooltipDismissed(true);
    }
    setIsOpen(false);
  };

  const showTooltip = () => {
    setIsTooltipVisible(true);
  };

  const handleEditInputChange = (e) => {
    setAnotherInputValue(e.target.value);

  };

  const handleChangeColor = () => {
    // Logique pour changer la couleur du texte
  };
  
  const handleChangeFont = () => {
    // Logique pour changer la police du texte
  };
  

const handleCustomInput2Change = (e) => {
    setCustomCategory(e.target.value);
  };  

  const handleCustomInput2KeyDown = (e) => {
    const inputValue = e.target.value;
  
    // Vérifie si la touche est un caractère imprimable
    const isPrintableKey =
      e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
  
    if (inputValue.length >= 6 && isPrintableKey) {
      e.preventDefault(); // Empêche la saisie supplémentaire
  
      // Si un toast est déjà affiché, le fermer
      if (toastId !== null) {
        toast.dismiss(toastId);
      }
  
      // Affiche un nouveau toast et enregistre son ID
      toastId = toast.error("Le nombre maximum de caractères pour le sigle est de 6.", {
        position: "top-right",        // Positionne le toast en haut à droite
        autoClose: 6000,              // Ferme automatiquement après 2 secondes
        style: {
          backgroundColor: "#87CEEB", // Fond bleu ciel
          color: "#ffffff",           // Texte blanc
        },
      });
    }
  };
  



  
  
  
  
  
  
  

  const onClose = () => {
    setIsDropdownOpen(false); // Ferme le dropdown
    setIsExiting1(false); // Réinitialise `isExiting1` pour préparer la prochaine ouverture
  };  

  const handleCloseBlendTooltip = () => {
    setIsExitingTooltip(true); // Lance l'animation de sortie
    setTimeout(() => {
      setIsBlendTooltipVisible(false);
      setIsExitingTooltip(false); // Réinitialise `isExitingTooltip`
    }, 300); // Durée de l'animation
  };

const handleCloseselectcard = () => {
  setIsExiting1(true); // Déclenche l'animation de sortie
  setTimeout(() => {
    setIsDropdownOpen(false); // Masque le dropdown après l'animation
    setIsExiting1(false); // Réinitialise `isExiting1`
  }, 300); // Durée de l'animation de sortie
};

const handleCloseTooltipPreviewCard = () => {
  setIsExitingTooltipPreviewCard(true);
  setTimeout(() => {
    setIsTooltipPreviewCardVisible(false);
    setIsExitingTooltipPreviewCard(false);
  }, 300);
};

const handleCloseTooltipStyledCard = () => {
  setIsExitingTooltipStyledCard(true);
  setTimeout(() => {
    setIsTooltipStyledCardVisible(false);
    setIsExitingTooltipStyledCard(false);
  }, 300);
};

const handleCloseTooltipPreview = () => {
  setIsExitingTooltipPreview(true);
  setTimeout(() => {
    setIsTooltipPreviewVisible(false);
    setIsExitingTooltipPreview(false);
  }, 300); // Durée de l'animation de sortie
};

const handleCloseTooltipStyled = () => {
  setIsExitingTooltipStyled(true);
  setTimeout(() => {
    setIsTooltipStyledVisible(false);
    setIsExitingTooltipStyled(false);
  }, 300); // Durée de l'animation de sortie
};

  const handleCloseTooltip2 = (isDefinitive = false) => {
    setIsExiting2(true); // Lance l'animation de disparition
    setTimeout(() => {
      setIsEditTooltipVisible2(false);
      setIsExiting2(false);
  
      if (isDefinitive) {
        setIsTooltipDismissed2(true);
        localStorage.setItem('isTooltipDismissed2', 'true');
      }
    }, 500); // Durée de l'animation
  };
  
  const handleCloseTooltip1 = () => {
    setIsTooltipVisible(false); // Masque le tooltip
  };

  const handleCloseTooltip3 = (isDefinitive = false) => {
    setIsExitingTooltip(true);
    setTimeout(() => {
      setIsTooltipVisible(false);
      setIsExitingTooltip(false);
  
      if (isDefinitive) {
        setIsTooltipDismissed3(true);
        localStorage.setItem('isTooltipDismissed3', 'true');
      }
    }, 500); // Durée de l'animation
  };
  
  
  
  const handleCloseImageTooltip = () => {
    setIsExiting(true);
    setTimeout(() => {
      setTooltipVisible(false);
      setIsExiting(false);
    }, 300); // Durée de l'animation de sortie
  };
  
  
  const handleCloseTooltip = (isDefinitive = false) => {
    setIsExiting(true);
    setTimeout(() => {
      setIsEditTooltipVisible(false);
      setIsExiting(false);
  
      if (isDefinitive) {
        // Marquer le tooltip comme définitivement fermé seulement si isDefinitive est true
        setIsTooltipDismissed(true);
        localStorage.setItem('isTooltipDismissed', 'true');
      }
    }, 500); // Durée de l'animation
  };
  
  
  

  
  const handleStyledCardClick = () => {
    setPreviewCardClicked(true);
    
    // Réinitialise l'effet après un court délai
    setTimeout(() => {
      setPreviewCardClicked(false);
    }, 200);
  };

  const getBlendedStyle = () => {
    const blendRatio = blendValue / 100; // Convertit la valeur en ratio (0 à 1)
    
    // Crée un style mélangé entre deux couleurs ou images
    const mixColor1 = selectedColor || '#ffffff'; // Couleur par défaut si aucune couleur n'est sélectionnée
    const mixColor2 = gradient || '#007bff'; // Gradient par défaut ou couleur de mélange
  
    return {
      background: `linear-gradient(135deg, ${mixColor1} ${100 - blendValue}%, ${mixColor2} ${blendValue}%)`,
      opacity: blendRatio, // Applique l'opacité basée sur la valeur de la barre
    };
  };

  const toggleCardVisibility = () => {
  event.preventDefault();  // Empêche le comportement par défaut, comme la soumission du formulaire
  setIsCardVisible(prev => !prev);
  };

  const handleSubscribeClick = () => {
    setIsSubscribed((prev) => !prev); // Basculer l'état d'abonnement
  
    setTimeout(() => {
      const numberOfSparkles = 12; // Nombre de paillettes
      const newSubscribeSparkles = Array.from({ length: numberOfSparkles }).map((_, index) => {
        const angle = (index / numberOfSparkles) * 2 * Math.PI; // Calcul de l'angle
        const dx = 50 * Math.cos(angle); // Déplacement en X
        const dy = 50 * Math.sin(angle); // Déplacement en Y
        return {
          id: index,
          dx,
          dy,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Couleur aléatoire
        };
      });
      setSubscribeSparkles(newSubscribeSparkles);
  
      setTimeout(() => setSubscribeSparkles([]), 1000); // Disparition après 1 seconde
    }, 500); // Délai pour synchroniser avec la fin du check
  };

  const handleOptionSelect = (value) => {
    setSelectedOption(value); // Met à jour l'option sélectionnée
    setTextPosition(value);
    setIsDropdownOpen(false);
    setUserSelectedPosition(value);
    setHasInteractedWithHiddenSelect(true);
    setIsUserPositionLocked(true);
    handleCloseDropdown();

    // Ajoute une condition pour ne montrer le tooltip que si InputIcon3 est visible
    if (value === 'bottom' && !tooltipDismissed && shouldShowInputIcon3) {
        setIsTooltipVisible(true);
    } else {
        setIsTooltipVisible(false);
    }
};

  

  const handleCloseDropdown = () => {
    setIsExiting(true); // Lance l'animation de sortie
    setTimeout(() => {
      setIsDropdownOpen(false); // Ferme le dropdown après l’animation
      setIsExiting(false); // Réinitialise isExiting pour la prochaine ouverture
    }, 300); // Durée de l'animation de sortie (ajustez si besoin)
  };
  

  const handlePreviewCardImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
  
      // Enregistrer la modification dans l'historique
      setActionHistory((prevHistory) => [
        ...prevHistory,
        {
          actionType: 'image',
          cardType: 'preview',
          previousValue: previewImage,
          newValue: imageUrl,
        },
      ]);
  
      setPreviewImage(imageUrl);
      setSmallCardImage1(imageUrl);
      setIsTrashVisible(true);
  
      // Indiquer que l'utilisateur a interagi en téléchargeant une image
      setHasInteracted(true);
    }
  };
  
  
  const handleStyledCardImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
  
     // Enregistrer la modification dans l'historique
setActionHistory((prevHistory) => [
  ...prevHistory,
  {
    actionType: 'image',
    cardType: 'styled',
    previousValue: styledCardImage,
    newValue: imageUrl, // Assurez-vous de définir la nouvelle valeur ici
  },
]);

  
      setStyledCardImage(imageUrl);
      setSmallCardImage2(imageUrl);
      setIsTrashVisible(true);
  
      // Indiquer que l'utilisateur a interagi en téléchargeant une image
      setHasInteracted(true);
    }
  };
  
  
  
  
  const handleUndoImage = () => {
    // Annuler pour le PreviewCard
    setPreviewImageHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const newHistory = [...prevHistory];
        const lastImage = newHistory.pop();
        setPreviewImage(lastImage);
        setSmallCardImage1(lastImage);
        return newHistory;
      } else {
        // S'il n'y a pas d'historique, supprimer l'image actuelle
        setPreviewImage(null);
        setSmallCardImage1(null);
        return [];
      }
    });
  
    // Annuler pour le StyledCard
    setStyledCardImageHistory((prevHistory) => {
      if (prevHistory.length > 0) {
        const newHistory = [...prevHistory];
        const lastImage = newHistory.pop();
        setStyledCardImage(lastImage);
        setSmallCardImage2(lastImage);
        return newHistory;
      } else {
        // S'il n'y a pas d'historique, supprimer l'image actuelle
        setStyledCardImage(null);
        setSmallCardImage2(null);
        return [];
      }
    });
  };
  

  const handleColorClick = (color) => {
    // Enregistrer la modification dans l'historique
    setActionHistory((prevHistory) => [
      ...prevHistory,
      {
        actionType: 'color',
        cardType: 'styled',
        previousValue: selectedColor,
      },
    ]);
  
    if (color.isTrash) {
      setSelectedColor(null);
    } else {
      setSelectedColor(color);
    }
  };
  
  

  const resetNextButtonState = () => {
    setDirection('next'); // Réinitialise la direction vers 'next'
    setIsAnimatingOut(false); // Arrête toute animation de sortie
    setIsConfigSectionLeftAnimating(false); // Arrête toute animation de ConfigSectionLeft
  };
  
  const isUndoDisabled = actionHistory.length === 0 || (!previewImage && !styledCardImage);
  const isRedoDisabled = redoStack.length === 0;


  const handleDeleteImage1 = (type) => {
    if (type === 'preview') {
      setPreviewImage(null); // Supprime l'image de PreviewCard
      setIsTrashVisible(false); // Cache la corbeille
      setSelectedImage(null); // Réinitialise l'image sélectionnée
      
      if (activeSession === 'configsectionleft') {
        setIsPhotoInsertedInConfig(false); // Réinitialise l'état de l'image insérée dans "configsectionleft"
        setStyledCardImage(null); // Supprime également l'image de StyledCard
      }
    } else if (type === 'styled') {
      setStyledCardImage(null); // Supprime l'image de StyledCard
    }
  };
  
  

  const handleLikeClick = (event) => {
    event.stopPropagation(); // Empêche l'événement de se propager au PreviewCard
    setIsLiked(!isLiked); // Alterne l'état du like
  
    // Génère des paillettes qui apparaissent lorsque l'on clique sur le like
    const newSparkles = Array.from({ length: 20 }).map((_, index) => ({
      id: index,
      dx: (Math.random() - 0.5) * 100, // Position aléatoire en x
      dy: (Math.random() - 0.5) * 100, // Position aléatoire en y
      color: `hsl(${Math.random() * 360}, 100%, 50%)`, // Couleur aléatoire
    }));
    setSparkles(newSparkles);
  
    // Supprime les paillettes après l'animation
    setTimeout(() => setSparkles([]), 1000);
  };
  
  const handleDeleteImage = (type) => {
    if (type === 'preview') {
      setDeletedPreviewImage(previewImage); // Stocker temporairement l'image avant suppression pour la restauration
      setPreviewImage(null); // Supprime l'image du PreviewCard
      setIsTrashVisible(false);
      setSelectedImage(null);
      setIsTrashIcon1Visible(false); // Cache l'icône de la corbeille pour le PreviewCard
    } else if (type === 'styled') {
      setDeletedStyledCardImage(styledCardImage); // Stocker temporairement l'image avant suppression pour la restauration
      setStyledCardImage(null); // Supprime l'image du StyledCard
      setIsTrashIcon2Visible(false); // Cache l'icône de la corbeille pour le StyledCard
    }
  
    if (type === 'styled' || type === 'preview') {
      setIsPhotoInsertedInConfig(false);
    }
  };
  

  const handleRestoreImage = (type) => {
    if (type === 'preview' && deletedPreviewImage) {
      setPreviewImage(deletedPreviewImage); // Restaure l'image du PreviewCard
      setSmallCardImage1(deletedPreviewImage); // Restaurer également l'image de la première petite carte
      setDeletedPreviewImage(null); // Réinitialise l'état temporaire
      setIsTrashIcon1Visible(true); // Remet l'icône de corbeille visible
    } else if (type === 'styled' && deletedStyledCardImage) {
      setStyledCardImage(deletedStyledCardImage); // Restaure l'image du StyledCard
      setSmallCardImage2(deletedStyledCardImage); // Restaurer également l'image de la deuxième petite carte
      setDeletedStyledCardImage(null); // Réinitialise l'état temporaire
      setIsTrashIcon2Visible(true); // Remet l'icône de corbeille visible
    }
  };
  

const handleBackClick = (event) => {
  setDirection('back');
  event.preventDefault();

  if (isColorCategoryCardVisible) {
    // Masquer "Choisissez une couleur" et afficher "Choisissez une catégorie"
    setIsColorCategoryCardVisible(false);
    setIsNewCardVisible(true);
    setActiveSession('newcard');
  } else if (isNewCardVisible) {
    // Revenir à "configsectionleft"
    setIsNewCardVisible(false);
    setIsConfigSectionLeftVisible(true);
    setActiveSession('configsectionleft');
  }
};

  
  
  

const handleBackClick2 = () => {
  setIsNewCardVisible(false);
  setIsConfigSectionLeftVisible(true);
};

  // Debugging dans le composant React
  useEffect(() => {
    console.log('isReturning state:', isReturning); // Vérifie l'état à chaque rendu
  }, [isReturning]);

  useEffect(() => {
    if ((isDropdownOpen || isExiting) && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isDropdownOpen, isExiting]);

  useEffect(() => {
    if (!isDropdownOpen) return;
  
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleCloseselectcard(); // Ferme avec animation sur clic extérieur
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleCloseDropdown();
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  
  useEffect(() => {
    if (!hasTooltipBeenShown && shouldShowInputIcon3) {
      setIsTooltipVisible(true);
    }
  }, [hasTooltipBeenShown, shouldShowInputIcon3]);
  

  useEffect(() => {
    if (isTooltipDismissed) return; // Ne rien faire si le tooltip est définitivement fermé
  
    const handleClickOutside = (event) => {
      if (
        isEditTooltipVisible &&
        editInputRef.current &&
        tooltipRef.current &&
        !editInputRef.current.contains(event.target) &&
        !tooltipRef.current.contains(event.target) // Vérifie si le clic est en dehors du tooltip
      ) {
        handleCloseTooltip(false); // Ferme le tooltip temporairement
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditTooltipVisible, isTooltipDismissed]); // Ajoutez `isTooltipDismissed` dans les dépendances
  
  useEffect(() => {
    if (isTooltipDismissed2) return; // Ne rien faire si le tooltip est définitivement fermé
  
    const handleClickOutside = (event) => {
      if (
        isEditTooltipVisible2 &&
        editInputRef2.current &&
        tooltipRef2.current &&
        !editInputRef2.current.contains(event.target) &&
        !tooltipRef2.current.contains(event.target) // Vérifie si le clic est en dehors du tooltip
      ) {
        handleCloseTooltip2(false); // Ferme le tooltip temporairement
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditTooltipVisible2, isTooltipDismissed2]);

  useEffect(() => {
    if (isEditTooltipVisible2 && editInputRef2.current) {
      editInputRef2.current.focus();
    }
  }, [isEditTooltipVisible2]);
  
  useEffect(() => {
    if (!isTooltipVisible) return;
  
    const handleClickOutside = (event) => {
      // Vérifie si le clic est à l'intérieur du tooltip
      if (tooltipRef3.current && tooltipRef3.current.contains(event.target)) {
        return;
      }
      // Vérifie si le clic est à l'intérieur du HiddenSelect
      if (hiddenSelectRef.current && hiddenSelectRef.current.contains(event.target)) {
        return;
      }
      // Ferme le tooltip si le clic est à l'extérieur
      handleCloseTooltip3();
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTooltipVisible]);
  
  

  useEffect(() => {
    if (isEditTooltipVisible && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditTooltipVisible]);  
  
  useEffect(() => {
    if (!hasTooltipBeenShown && shouldShowInputIcon3) {
      setIsTooltipVisible(true);
    }
  }, [hasTooltipBeenShown, shouldShowInputIcon3]);
  
  useEffect(() => {
    if (hasInteractedWithHiddenSelect) {
      if (textPosition === 'bottom' && !tooltipDismissed && shouldShowInputIcon3) {
        setIsTooltipVisible(true);
      } else {
        setIsTooltipVisible(false);
      }
    }
  }, [textPosition, hasInteractedWithHiddenSelect, tooltipDismissed, shouldShowInputIcon3]);
  
  useEffect(() => {
    if (!isCardVisible) {
      setShouldRenderCardGroup(true);
      setShouldRenderDescription(true);
    } else {
      // Attendre la fin de l'animation avant de retirer les composants du DOM
      const timeoutId = setTimeout(() => {
        setShouldRenderCardGroup(false);
        setShouldRenderDescription(false);
      }, 500); // Durée de l'animation en millisecondes
      return () => clearTimeout(timeoutId);
    }
  }, [isCardVisible]);
  
  useEffect(() => {
    if (hasInteractedWithHiddenSelect) {
      if (textPosition === 'bottom' && !tooltipDismissed) {
        setIsTooltipVisible(true);
      } else {
        setIsTooltipVisible(false);
      }
    }
  }, [textPosition, hasInteractedWithHiddenSelect, tooltipDismissed]);
  

  useEffect(() => {
    if (isColorCategoryCardVisible) {
      setShouldRenderColorCard(true);
    } else {
      setTimeout(() => setShouldRenderColorCard(false), 500); // 500ms correspond à la durée de votre transition
    }
  }, [isColorCategoryCardVisible]);
  
  
  const handlePreviewCardClick = (event) => {
    // Vérifie si l'élément cliqué a l'attribut data-ignore-click
    if (event.target.closest('[data-ignore-click="true"]')) {
      return; // Ne rien faire si le clic vient du bouton de commentaire
    }
  
    const target = event.currentTarget; // Référence à l'élément cliqué
  
    if (target) {
      // Vérifie que target n'est pas null avant d'accéder à son style
      console.log('PreviewCard clicked');
      target.style.transform = 'scale(0.95)';
  
      // Réinitialise l'effet après un court délai
      setTimeout(() => {
        target.style.transform = 'scale(1)';
      }, 200);
  
      // Ajoute l'animation des cœurs
      const newHearts = Array.from({ length: 5 }).map((_, index) => ({
        id: index,
        top: Math.random() * 100, // Position aléatoire en hauteur
        left: Math.random() * 100, // Position aléatoire en largeur
      }));
  
      setBurstHearts([...burstHearts, ...newHearts]);
  
      // Supprime les cœurs après 1 seconde
      setTimeout(() => setBurstHearts([]), 1000);
    }
  };
  
  const handleCommentClick = (event) => {
    event.stopPropagation(); // Empêche l'événement de clic de se propager au PreviewCard
    // Ajoutez ici toute logique supplémentaire pour le clic sur le commentaire
  };
  
  const handleDeleteSmallCardImage = (card) => {
    if (card === 'smallCard1') {
      setSmallCardImage1(null); // Supprime l'image de la première petite carte
      setIsTrashIcon1Visible(false); // Rend l'icône de la corbeille invisible
    } else if (card === 'smallCard2') {
      setSmallCardImage2(null); // Supprime l'image de la deuxième petite carte
    }
  
    document.getElementById(card === 'smallCard1' ? 'preview-card-input' : 'styled-card-input').value = null;
  };
  
  
  const handleNextClick = (event) => {
    event.preventDefault();
  
    if (!selectedImage) {
      setForceShowInitials(true);
    }
  
    setActiveSession('newcard'); // Mise à jour de la session active
  
    // Commencer l'animation de sortie de ConfigSectionLeft
    setIsConfigSectionLeftVisible(false); // Déclenche l'animation de sortie
  
    // Attendre que l'animation de sortie se termine avant d'afficher NewCard
    setTimeout(() => {
      setDirection('next'); // Définir la direction avant d'afficher NewCard
      setIsNewCardVisible(true); // Afficher NewCard
    }, 500); // Ajustez ce délai à la durée de votre animation de sortie
  };
  
  const handleTextOverflow = () => {
    if (isUserPositionLocked) return; // Respecte le choix de l'utilisateur
  
    if (anotherInputValue.length >= 10 && shouldShowInputIcon3) {
      setTextPosition('bottom');
      if (!tooltipDismissed) {
        if (isEditTooltipVisible) {
          handleCloseTooltip(false);
          setTimeout(() => {
            setIsTooltipVisible(true);
          }, 500);
        } else {
          setIsTooltipVisible(true);
        }
      }
    } else {
      setTextPosition('current');
      setIsTooltipVisible(false);
    }
  }    
  

  
  useEffect(() => {
    handleTextOverflow();
  }, [anotherInputValue]);
  
  
  // Appelle cette fonction dans un `useEffect` pour surveiller les changements de `anotherInputValue`
  useEffect(() => {
    handleTextOverflow();
  }, [anotherInputValue]);
  
  
  useEffect(() => {
    handleTextOverflow();
  }, [anotherInputValue]);
  
  // Appelle cette fonction dans un `useEffect` pour surveiller les changements de `anotherInputValue`
  useEffect(() => {
    handleTextOverflow();
  }, [anotherInputValue]);

  useEffect(() => {
    console.log('textPosition:', textPosition);
    console.log('anotherInputValue:', anotherInputValue);
    console.log('isTooltipVisible:', isTooltipVisible);
  }, [textPosition, anotherInputValue, isTooltipVisible]);
  
  
  
  const handleNextClick2 = (event) => {
    event.preventDefault();
  
    // Assurez-vous que la direction est définie sur 'next' ici
    setDirection('next');
  
    setIsNewCardVisible(false); // Déclenche l'animation de sortie vers la gauche
    
    setTimeout(() => {
      setIsColorCategoryCardVisible(true); 
    }, 500); // Ajustez la durée pour synchroniser les animations
  };
  

  
  const adjustColor = (color, amount) => {
    let usePound = false;
  
    if (color[0] === "#") {
      color = color.slice(1);
      usePound = true;
    }
  
    const num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    let b = ((num >> 8) & 0x00ff) + amount;
    let g = (num & 0x0000ff) + amount;
  
    if (r > 255) r = 255;
    else if (r < 0) r = 0;
  
    if (b > 255) b = 255;
    else if (b < 0) b = 0;
  
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
  
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
  };


  useEffect(() => {
    if (isReturning) {
      newCardRef.current.classList.remove(styles.slideOutToRight);
      newCardRef.current.classList.add(styles.slideInRight);
    }
  }, [isReturning]);

  
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
  
          if (response.data.profileImage) {
            const img = new Image();
            img.src = response.data.profileImage;
            img.crossOrigin = 'Anonymous';
  
            img.onload = () => {
              Vibrant.from(img)
                .getPalette()
                .then(palette => {
                  if (palette && palette.Vibrant) {
                    const vibrantColor = adjustColor(palette.Vibrant.hex, 30);
                    const blueColor = '#007bff';
                    const mixedGradient = `linear-gradient(135deg, ${vibrantColor}, ${blueColor})`;
                    setGradient(mixedGradient);
                  }
                })
                .catch(err => console.error('Erreur Vibrant:', err));
            };
  
            img.onerror = (err) => {
              console.error('Erreur lors du chargement de l\'image:', err);
            };
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
      }
    };
  
    fetchUserInfo();
  }, []);
  

  useEffect(() => {
    if (!isNewCardVisible) {
      setIsCategoryCardLeaving(false); // Réinitialiser l'état lorsqu'on revient
    }
  }, [isNewCardVisible]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isCardOpen && 
          !event.target.closest('.menu-bar') && 
          !event.target.closest('.header') && 
          !event.target.closest('.animated-card')) {
        setIsCardOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCardOpen]);

  useEffect(() => {
    if (isReturning) {
      // Réinitialiser l'animation après son exécution
      const timeout = setTimeout(() => {
        setIsReturning(false);
      }, 1500); // Durée de l'animation (1.5 secondes)
  
      return () => clearTimeout(timeout);
    }
  }, [isReturning]);

  const handleCreateClick = () => {
    setIsCardOpen(true);
  };

  const handleConfigClick = () => {
    setIsConfigOpen(true);
    setIsInPhotoSection(true); // Masquer la flèche dans la section "Ajouter une photo"
    
    // Réinitialiser les tooltips pour qu'ils soient visibles lors de la création d'un nouveau vlog
    setIsCreatingNewVlog(true); // Indique que l'utilisateur crée un nouveau vlog
    setIsTooltipDismissed(false); // Réinitialise pour afficher le tooltip de `ConfigInput3`
    setIsTooltipDismissed2(false); // Réinitialise pour afficher le tooltip de `ConfigInput2`
  };
  


  const handleUndoAction = () => {
    if (actionHistory.length > 0) {
      const lastAction = actionHistory[actionHistory.length - 1];
  
      // Mettre à jour actionHistory et redoStack
      setActionHistory((prevHistory) => prevHistory.slice(0, -1));
      setRedoStack((prevRedoStack) => [lastAction, ...prevRedoStack]);
  
      if (lastAction.actionType === 'image') {
        if (lastAction.cardType === 'preview') {
          setPreviewImage(lastAction.previousValue);
          setSmallCardImage1(lastAction.previousValue);
        } else if (lastAction.cardType === 'styled') {
          setStyledCardImage(lastAction.previousValue);
          setSmallCardImage2(lastAction.previousValue);
        } else if (lastAction.cardType === 'both') {
          // Restaurer les images des deux cartes
          setPreviewImage(lastAction.previousValue.preview);
          setSmallCardImage1(lastAction.previousValue.preview);
          setStyledCardImage(lastAction.previousValue.styled);
          setSmallCardImage2(lastAction.previousValue.styled);
        }
      } else if (lastAction.actionType === 'color') {
        setSelectedColor(lastAction.previousValue);
      }
    }
  };
  

  const handleRedoAction = () => {
    if (redoStack.length > 0) {
      const lastUndoneAction = redoStack[0];
  
      setRedoStack((prevRedoStack) => prevRedoStack.slice(1));
      setActionHistory((prevHistory) => [...prevHistory, lastUndoneAction]);
  
      if (lastUndoneAction.actionType === 'image') {
        if (lastUndoneAction.cardType === 'preview') {
          setPreviewImage(lastUndoneAction.newValue);
          setSmallCardImage1(lastUndoneAction.newValue);
        } else if (lastUndoneAction.cardType === 'styled') {
          setStyledCardImage(lastUndoneAction.newValue);
          setSmallCardImage2(lastUndoneAction.newValue);
        } else if (lastUndoneAction.cardType === 'both') {
          // Restaurer les images des deux cartes
          setPreviewImage(lastUndoneAction.newValue.preview);
          setSmallCardImage1(lastUndoneAction.newValue.preview);
          setStyledCardImage(lastUndoneAction.newValue.styled);
          setSmallCardImage2(lastUndoneAction.newValue.styled);
        }
      } else if (lastUndoneAction.actionType === 'color') {
        setSelectedColor(lastUndoneAction.newValue);
      }
    }
  };
  
  
  
  const handleCreate = () => {
    console.log("Le bouton Créer a été cliqué !");
    // Ajoutez ici les actions à réaliser quand le bouton est cliqué.
  };
  

  const handleConfigInput2Change = (e) => {
    const value = e.target.value;
  
    if (value.length <= 6) {
      setCustomCategory(value);
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  
  };
  
  

  const handleConfigClose = () => {
    setIsConfigOpen(false);
  };

  const handleCardClose = () => {
    setIsCardOpen(false);
  };

const handleImageChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    const imageUrl = URL.createObjectURL(e.target.files[0]);

    // Affiche l'icône de corbeille du PreviewCard dès qu'une image est insérée
    setIsTrashIcon1Visible(true);

    if (activeSession === 'configsectionleft') {
      setActionHistory((prevHistory) => [
        ...prevHistory,
        {
          actionType: 'image',
          cardType: 'preview',
          previousValue: previewImage,
          newValue: imageUrl,
        },
      ]);

      // Mise à jour de l'image du PreviewCard
      setPreviewImage(imageUrl);
      setSmallCardImage1(imageUrl);
      setIsTrashVisible(true);
      setSelectedImage(imageUrl);
      setIsPhotoInsertedInConfig(true);
      setImageInsertedFrom('configsectionleft');

    } else if (activeSession === 'newcard') {
      // Enregistrer une action pour les deux cartes
      setActionHistory((prevHistory) => [
        ...prevHistory,
        {
          actionType: 'image',
          cardType: 'both', // Indique que l'image a été insérée dans les deux cartes
          previousValue: {
            preview: previewImage,
            styled: styledCardImage,
          },
          newValue: {
            preview: imageUrl,
            styled: imageUrl,
          },
        },
      ]);

      // Mise à jour des images des deux cartes
      setPreviewImage(imageUrl);
      setSmallCardImage1(imageUrl);
      setStyledCardImage(imageUrl);
      setSmallCardImage2(imageUrl);
      setIsTrashVisible(true);
      setIsTrashIcon2Visible(true);
      setSelectedImage(imageUrl);
      setImageInsertedFrom('newcard');
    }

    setForceShowInitials(false);
    e.target.value = null;
  }
};

  const handleImageUploadClick = () => {
    document.querySelector('input[type="file"]').click();
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
  
    // Enregistrer la modification dans l'historique
    setActionHistory((prevHistory) => [
      ...prevHistory,
      {
        actionType: 'text',
        cardType: 'preview',
        previousValue: vlogTitle,
        property: 'vlogTitle',
      },
    ]);
  
    setVlogTitle(value);
    setShowRadioButtons(value.length > 0);
  
    if (value) {
      setAnotherInputValue('');
    }
  };
   

  const getInitials = (username) => {
    const nameParts = username.split(' ');
  
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase(); // Retourne la première lettre en majuscule
    } else if (nameParts.length >= 2) {
      return (
        nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase()
      ); // Retourne les deux premières lettres en majuscules
    }
    return '';
  };
  

  if (!userInfo) {
    return <div>Chargement...</div>;
  }

  return (

    <HomeContainer>

//contener

{showAlert && (
        <AlertToast>La limite de 6 caractères est atteinte</AlertToast>
      )}

      <Header className="header">
        <Logo>VloGot</Logo>
        <ProfileWrapper>
          <ProfileImage src={userInfo.profileImage} alt="Profile" />
          <Username>{userInfo.username}</Username>
        </ProfileWrapper>
      </Header>
      <ContentSection>
        {activeSection === 'home' && <div>Contenu de la page Home</div>}
        {activeSection === 'message' && <div>Contenu des Messages</div>}
        {activeSection === 'v' && <div>Contenu de la section V</div>}
        {activeSection === 'settings' && <div>Contenu des Paramètres</div>}
      </ContentSection>
      <MenuBar className="menu-bar">
        <MenuItem active={activeSection === 'home'} onClick={() => setActiveSection('home')}>
          <FaHome />
          Home
        </MenuItem>
        <MenuItem active={activeSection === 'message'} onClick={() => setActiveSection('message')}>
          <FaEnvelope />
          Message
        </MenuItem>
        <CreateButton onClick={handleCreateClick}>
          <FaPlus />
          Créer
        </CreateButton>
        <MenuItem active={activeSection === 'v'} onClick={() => setActiveSection('v')}>
          <FaCheck />
          Vlog
        </MenuItem>
        <MenuItem active={activeSection === 'settings'} onClick={() => setActiveSection('settings')}>
          <FaCog />
          Paramètre
        </MenuItem>
      </MenuBar>


      <AnimatedCard isOpen={isCardOpen} className="animated-card">
        <h2>Créer un Vlog</h2>
        <CardWrapper>
          <CreateCard onClick={handleConfigClick}>
            <MultiVlogIconBackground as={FaCamera} top={20} left={10} />
            <MultiVlogIconBackground as={FaMusic} top={30} left={50} />
            <MultiVlogIconBackground as={FaFileAlt} top={60} left={20} />
            <MultiVlogIconBackground as={FaVideo} top={60} left={70} />
            <MultiVlogIconBackground as={FaFilm} top={15} left={40} />
            <MultiVlogIconBackground as={FaFilePdf} top={80} left={10} />
            <MultiVlogIconBackground as={FaMicrophone} top={20} left={80} />
            <MultiVlogIconBackground as={FaImage} top={40} left={30} />
            <MultiVlogIconBackground as={FaHeadphones} top={80} left={60} />
            <VlogText>Nouveau Vlog</VlogText>
            <PlusButton onClick={handleConfigClick}>+</PlusButton>
          </CreateCard>
        </CardWrapper>
        <CloseButtonBottom onClick={handleCardClose}>Fermer</CloseButtonBottom>
        <CloseIcon onClick={handleCardClose}>✖</CloseIcon>
      </AnimatedCard>


      <ConfigCard 
  isConfigOpen={isConfigOpen} 
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
    color: 'blue',
    setShouldRenderColorCard: 'blue',
    position: 'fixed',
    marginTop: '20px',
    maxHeight: '80vh',
    overflowY: 'auto',
    width: '80vw',
  }}
>


<style>
    {`
      /* Cible la scrollbar uniquement pour ConfigCard */
      div[style*="overflow-y: auto"]::-webkit-scrollbar {
        width: 10px; /* Largeur de la scrollbar */
      }

      div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
        background-color: #87CEEB; /* Couleur de la scrollbar */
        border-radius: 10px; /* Arrondi des bords */
        margin-top: 200px; /* Ajoute un espace au début */
        height: 50px; /* Définit une longueur fixe pour le pouce */
      }

      div[style*="overflow-y: auto"]::-webkit-scrollbar-track {
        background-color: #f1f1f1; /* Couleur du rail */
        border-radius: 10px; /* Arrondi des bords */
      }
    `}
  </style>

  {/* Titre centré en haut */}
  <h2 style={{
    textAlign: 'center',
    fontSize: '1.8rem',
    marginBottom: '10px'
  }}>
    Paramètres de Configuration
  </h2>

  {/* Conteneur des PreviewCards en grille */}
  <div style={{
    display: 'grid',
    marginLeft: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    justifyContent: 'center',
  }}>
    {Array.from({ length: 12 }, (_, index) => (
      <PreviewCard
        key={index}
        backgroundImage={previewImage}
        selectedColor={selectedColor}
        gradient={gradient}
        onClick={handlePreviewCardClick}
        style={{ transform: previewCardClicked ? 'scale(0.95)' : 'scale(1)' }}
      >
        <ShareButton data-ignore-click="true">
          <FaShare />
        </ShareButton>

        <MultiVlogIconBackground as={FaCamera} top={20} left={10} />
        <MultiVlogIconBackground as={FaMusic} top={30} left={50} />
        <MultiVlogIconBackground as={FaFileAlt} top={60} left={20} />
        <MultiVlogIconBackground as={FaVideo} top={60} left={70} />
        <MultiVlogIconBackground as={FaFilm} top={15} left={40} />
        <MultiVlogIconBackground as={FaFilePdf} top={80} left={10} />
        <MultiVlogIconBackground as={FaMicrophone} top={20} left={80} />
        <MultiVlogIconBackground as={FaImage} top={40} left={30} />
        <MultiVlogIconBackground as={FaHeadphones} top={80} left={60} />

        <ProfileImageCircle isSubscribed={isSubscribed} data-ignore-click="true">
          <img src={userInfo.profileImage} alt="Profile" />
        </ProfileImageCircle>

        <PreviewVlogText style={{ color: titleColor }}>
          {anotherInputValue ? null : vlogTitle}
        </PreviewVlogText>

        <SubscribeButton
          onClick={handleSubscribeClick}
          data-ignore-click="true"
          className={isSubscribed ? 'clicked' : ''}
        >
          {isSubscribed ? (
            <div style={{ position: 'relative' }}>
              <AnimatedCheck>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <circle className="circle" cx="12" cy="12" r="10" />
                  <polyline className="check" points="9 12 12 15 17 10" />
                </svg>
              </AnimatedCheck>
              {subscribeSparkles.map((sparkle) => (
                <SubscribeSparkleLinear
                  key={sparkle.id}
                  color={sparkle.color}
                  style={{
                    '--dx': `${sparkle.dx}px`,
                    '--dy': `${sparkle.dy}px`,
                  }}
                />
              ))}
            </div>
          ) : (
            "S'abonner"
          )}
        </SubscribeButton>

        <StyledCard
          gradient={gradient}
          imageUrl={styledCardImage}
          blendValue={blendValue}
          onClick={handleStyledCardClick}
        >
          {!styledCardImage ? (
            <TextContainer
              style={{
                fontSize: customCategory && customCategory.length === 6 ? '2.3rem' : '3rem',
                zIndex: 2,
                position: 'relative',
              }}
            >
              {customCategory ? customCategory.toUpperCase() : getInitials(userInfo.username)}
            </TextContainer>
          ) : (
            (imageInsertedFrom === 'newcard' || !!smallCardImage2) && customCategory ? (
              <TextContainer
                style={{
                  fontSize: customCategory.length === 6 ? '2.3rem' : '3rem',
                  zIndex: 2,
                  position: 'relative',
                }}
              >
                {customCategory.toUpperCase()}
              </TextContainer>
            ) : null
          )}
        </StyledCard>

        <LikeBubble onClick={handleLikeClick} data-ignore-click="true" isLiked={isLiked}>
          <FaHeart />
          {sparkles.map((sparkle) => (
            <Sparkle
              key={sparkle.id}
              color={sparkle.color}
              style={{
                '--dx': `${sparkle.dx}px`,
                '--dy': `${sparkle.dy}px`,
              }}
            />
          ))}
        </LikeBubble>

        <CommentBubble onClick={handleCommentClick} data-ignore-click="true">
          <FaComment />
        </CommentBubble>
      </PreviewCard>
    ))}
  </div>
</ConfigCard>


  
    </HomeContainer>
  );
  
};

export default Home;