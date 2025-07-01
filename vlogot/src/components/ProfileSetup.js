import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlus, FaEdit, FaPencilAlt, FaTimes, FaTrash, FaCamera, FaImages, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import getCroppedImg from './getCroppedImg';

const Background = styled.div`
  background: linear-gradient(135deg, #1e90ff, #00bfff);
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  gap:50px;
`;


const ContentWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
`;

const Card = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 100%;
  z-index: 2;
`;


const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
`;

const CancelButton = styled.button`
  position: absolute;
  top: -10px;       
  right: -100px;     
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: white;
  background: #ff6347;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')}; 
  &:hover {
    background: #e5533c;
  }
`;

const DropzoneContainer = styled.div`
  border: 2px dashed #007bff;
  border-radius: 50%;
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px auto;
  cursor: pointer;
  background-color: #f8f8f8;
  position: relative;
`;

const PreviewImage = styled.img`
  border-radius: 50%;
  width: 150px;
  height: 150px;
  object-fit: cover;
`;

const ModalPreviewImage = styled.img`
  border-radius: 50%;
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-top: 10px;
`;

const IconContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: #007bff;
  border-radius: 50%;
  padding: 5px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
  transition: all 0.3s ease;
  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  &:hover {
    background: #0056b3;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const AnimatedModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 50px;
  text-align: center;
  animation: ${fadeInUp} 0.3s ease-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 350px;
  margin: auto;
`;

const ModalButton = styled.button`
  margin: 5px;
  padding: 5px;
  font-size: 0.80rem;
  color: white;
  background: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    background: #0056b3;
  }
`;

const ButtonIcon = styled.div`
  font-size: 1rem;
  margin-bottom: 3px;
`;

const EditCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 300px;
  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000; /* Au-dessus de tout sauf l'overlay de chargement */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ChangeButton = styled(Button)`
  display: flex;
  align-items: center;
`;

const PencilIcon = styled(FaPencilAlt)`
  margin-right: 5px;
`;

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #007bff;
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    color: #0056b3;
  }
`;

const OptionsCard = styled.div`
  position: absolute;
  top: 250px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeInUp} 0.3s ease-out;
  z-index: 10;
  width: 150px;
`;

const OptionButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  font-size: 1rem;
  margin: 10px 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  &:hover {
    color: #0056b3;
  }
`;

const OptionIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 5px;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const LoadingSpinner = styled.div`
  border: 8px solid #f3f3f3;
  border-top: 8px solid #3498db;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const FilterControls = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
`;

const FilterSlider = styled.input`
  width: 60px;
`;

const SliderWrapper = styled.div`
  height: 400px;
  width: 120px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #fff;
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')}; /* Display conditionnel */
  animation: ${({ isVisible }) => (isVisible ? fadeIn : 'none')} 0.5s ease-in-out;
`;

const ArrowButton = styled.div`
  position: absolute;
  left: 70%;
  transform: translateX(-50%);
  z-index: 10;
  background-color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: ${({ isVisible }) => (isVisible ? 'flex' : 'none')}; /* Display conditionnel */
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const StyleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  max-height: 300px;
  max-width: 150px;
  overflow: hidden;
  margin-top: 20px;
`;

const StyleList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyleCard = styled.div`
  width: 100.5px;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  position: relative;
`;

const StyleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const StyleNameOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 5px;
  font-size: 0.9rem;
`;

const BlurOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px); /* Appliquer un flou */
  background: rgba(0, 0, 0, 0.3); /* Optionnel : Ajouter une superposition sombre */
  z-index: 998; /* Juste en dessous de l'EditCard */
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')}; /* Afficher uniquement si visible */
`;

Modal.setAppElement('#root');

// Place styles here to avoid reference errors
const styles = [
  { id: 'normal', name: 'Normal', filter: 'none' },
  { id: 'bright', name: 'Luminosité', filter: 'brightness(150%) contrast(100%) saturate(100%) sepia(0%)' },
  { id: 'dark', name: 'Sombre', filter: 'brightness(50%) contrast(150%) saturate(100%) sepia(0%)' },
  { id: 'grayscale', name: 'Gris', filter: 'brightness(100%) contrast(100%) saturate(0%) sepia(0%)' },
  { id: 'sepia', name: 'Sépia', filter: 'brightness(100%) contrast(100%) saturate(100%) sepia(100%)' },
  { id: 'negative', name: 'Négatif', filter: 'brightness(100%) contrast(100%) saturate(100%) sepia(0%) invert(100%)' },
  { id: 'vintage', name: 'Vintage', filter: 'brightness(100%) contrast(120%) saturate(80%) sepia(50%)' },
  { id: 'polaroid', name: 'Polaroid', filter: 'brightness(120%) contrast(90%) saturate(110%) sepia(10%)' },
  { id: 'popart', name: 'Pop Art', filter: 'brightness(110%) contrast(140%) saturate(150%) sepia(0%)' },
  { id: 'comic', name: 'Comic', filter: 'brightness(90%) contrast(130%) saturate(80%) sepia(0%)' },
  { id: 'warm', name: 'Chaud', filter: 'brightness(100%) contrast(100%) saturate(120%) sepia(20%)' },
  { id: 'cool', name: 'Froid', filter: 'brightness(100%) contrast(100%) saturate(100%) sepia(0%)' },
  { id: 'muted', name: 'Atténué', filter: 'brightness(90%) contrast(90%) saturate(70%) sepia(0%)' },
  { id: 'highcontrast', name: 'Haut contraste', filter: 'brightness(100%) contrast(150%) saturate(100%) sepia(0%)' },
  { id: 'vivid', name: 'Vif', filter: 'brightness(130%) contrast(130%) saturate(150%) sepia(0%)' },
];

const ProfileSetup = () => {
  const [file, setFile] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [filteredImages, setFilteredImages] = useState({});
  const [username, setUsername] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [cameraModalIsOpen, setCameraModalIsOpen] = useState(false);
  const [optionsCardVisible, setOptionsCardVisible] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [initialCrop, setInitialCrop] = useState({ x: 0, y: 0 });
  const [initialZoom, setInitialZoom] = useState(1);
  const [cameraStream, setCameraStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [sepia, setSepia] = useState(0);
  const [isStyleApplied, setIsStyleApplied] = useState(false);
  const [isSliderVisible, setSliderVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('none');
  const sliderRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [isCancelButtonVisible, setIsCancelButtonVisible] = useState(false);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [token]);

  const resetFilter = () => {
    setActiveFilter('none'); // Réinitialise le filtre à "none"
    setIsStyleApplied(false); // Marque le filtre comme non appliqué
    setIsCancelButtonVisible(false);
  };

  const applyFilterToImage = (filter) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = originalFile;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.filter = filter;
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL());
      };

      img.onerror = (err) => reject(err);
    });
  };

  useEffect(() => {
    if (originalFile) {
      const generateFilteredImages = async () => {
        const newFilteredImages = {};
        for (const style of styles) {
          const filteredImage = await applyFilterToImage(style.filter);
          newFilteredImages[style.id] = filteredImage;
        }
        setFilteredImages(newFilteredImages);
      };

      generateFilteredImages();
    }
  }, [originalFile]);

  const onDrop = (acceptedFiles) => {
    setLoading(true);
    try {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setFile(url);
      setOriginalFile(url);
      setCroppedArea(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setInitialCrop({ x: 0, y: 0 });
      setInitialZoom(1);
      setSliderVisible(true); // Rendre le slider visible lorsqu'une photo est ajoutée
    } catch (error) {
      toast.error('Erreur lors du téléchargement de l\'image.');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !username) {
      toast.error('Veuillez ajouter une photo de profil et un pseudo.');
      return;
    }
    setLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5000/api/update-profile', {
        username,
        profileImage: file,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        toast.success('Profil mis à jour avec succès!');
        setTimeout(() => {
          setLoading(false);
          navigate('/profile-confirmation', {
            state: {
              profileImage: file,
              username,
              // Ajoutez ici d'autres informations que vous souhaitez passer à la page de confirmation
            }
          });
        }, 2000);
      } else {
        toast.error('Erreur lors de la mise à jour du profil.');
      }
    } catch (error) {
      toast.error('Erreur lors de la communication avec le serveur.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const openEditModal = () => {
    setCrop(initialCrop);
    setZoom(initialZoom);
    setEditModalIsOpen(true);
  };

  const closeEditModal = () => setEditModalIsOpen(false);

  const openCameraModal = async () => {
    setCameraModalIsOpen(true);
    try {
      setLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraStream(stream);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur lors de l\'accès à la caméra. Veuillez vérifier les autorisations de la caméra.');
      setLoading(false);
      setCameraModalIsOpen(false);
    }
  };

  const closeCameraModal = () => {
    setCameraModalIsOpen(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const capturePhoto = () => {
    setLoading(true);
    try {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const image = canvasRef.current.toDataURL('image/png');
      setFile(image);
      setOriginalFile(image);
      setCroppedArea(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setSliderVisible(true); // Rendre le slider visible lorsqu'une photo est capturée
    } catch (error) {
      toast.error('Erreur lors de la capture de la photo.');
    } finally {
      setLoading(false);
      closeCameraModal();
    }
  };

  const onCropComplete = useCallback((croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
    setInitialCrop(crop);
    setInitialZoom(zoom);
  }, [crop, zoom]);

  const handleCropChange = useCallback((newCrop) => {
    setCrop(newCrop);
  }, []);

  const handleZoomChange = useCallback((newZoom) => {
    setZoom(newZoom);
  }, []);
  const handleSave = async () => {
    setLoading(true);
    try {
      if (croppedArea && originalFile) {
        const croppedImage = await getCroppedImg(originalFile, croppedArea);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = croppedImage;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
  
          // Appliquer les filtres des curseurs même si aucune filter card n'est sélectionnée
          ctx.filter = `
            brightness(${brightness}%)
            contrast(${contrast}%)
            saturate(${saturation}%)
            sepia(${sepia}%)
          `;
  
          ctx.drawImage(img, 0, 0);
  
          const filteredImage = canvas.toDataURL('image/png');
  
          // Mettre à jour l'image recadrée et filtrée dans l'état
          setFile(filteredImage);
          
  
          setLoading(false);
          toast.success('Photo de profil mise à jour avec succès!');
          closeEditModal();
        };
      }
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde de l\'image recadrée.');
      setLoading(false);
    }
  };
  
  
  
  

  const handleStyleSelect = (styleId) => {
    const selectedStyle = styles.find((style) => style.id === styleId);
    if (selectedStyle) {
      setActiveFilter(selectedStyle.filter);
      setIsStyleApplied(true);
      setIsCancelButtonVisible(true); // Rendre visible le bouton "Annuler le filtre" lorsqu'un filtre est appliqué
    }
  };
  

  const handleOption = (option) => {
    closeModal();
    switch (option) {
      case 'edit':
        openEditModal();
        break;
      case 'delete':
        setLoading(true);
        try {
          setFile(null);
          setOriginalFile(null);
          setCroppedArea(null);
          setCrop({ x: 0, y: 0 });
          setZoom(1);
          setSliderVisible(false); // Masquer le slider lorsque l'image est supprimée
          setIsCancelButtonVisible(false); // Masquer le bouton "Annuler le filtre"
          toast.success('Photo de profil supprimée');
        } catch (error) {
          toast.error('Erreur lors de la suppression de l\'image.');
        } finally {
          setLoading(false);
        }
        break;
      case 'camera':
        openCameraModal();
        break;
      default:
        break;
    }
  };

  const toggleOptionsCard = (e) => {
    e.stopPropagation();
    setOptionsCardVisible(!optionsCardVisible);
  };

  const handleClickOutside = (e) => {
    if (optionsCardVisible) {
      setOptionsCardVisible(false);
    }
  };

  useEffect(() => {
    if (optionsCardVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [optionsCardVisible]);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    centerMode: true,
    centerPadding: '0',
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const resetStyle = () => {
    setFile(originalFile);
    setIsStyleApplied(false);
  };

const FilterGridContainer = styled.div`
  position: absolute;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  height: 410px;
  width: 350px;
  overflow-y: auto;
  background: transparent;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 1fr;
  gap: 12px;
  justify-items: center;
  align-items: center;

  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #007bff;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  scrollbar-width: auto;
  scrollbar-color: #007bff transparent;

  /* ✅ Responsive ajustement */
  @media (max-width: 768px) {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
    width: 100%;
    height: auto;
    margin-top: 20px;
    grid-template-columns: 1fr;
    justify-items: center;
  }
`;




  return (
    <Background>
      {loading && (
        <LoadingOverlay>
          <LoadingSpinner />
        </LoadingOverlay>
      )}
      <BlurOverlay isVisible={editModalIsOpen} />
      <ToastContainer />
      <Card>
        <Title>Configurer votre profil</Title>
        <Subtitle>Ajoutez une photo de profil et un pseudo</Subtitle>
        {isCancelButtonVisible && (
  <CancelButton onClick={resetFilter} isVisible={isCancelButtonVisible}>
    Annuler
  </CancelButton>
)}
        <DropzoneContainer {...getRootProps()} onClick={toggleOptionsCard}>
          <input {...getInputProps()} />
          {file ? (
            <>
              <PreviewImage src={file} alt="Preview" style={{ filter: activeFilter }} />
              <IconContainer onClick={(e) => { e.stopPropagation(); openModal(); }}>
                <FaEdit />
              </IconContainer>
            </>
          ) : (
            <>
              <div>Cliquez ou déposez une image ici</div>
              <IconContainer onClick={toggleOptionsCard}>
                <FaPlus />
              </IconContainer>
            </>
          )}
        </DropzoneContainer>
        <Input
          type="text"
          placeholder="Entrez votre pseudo"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button onClick={handleSubmit}>Enregistrer</Button>
        {optionsCardVisible && (
          <OptionsCard>
            <OptionButton onClick={open}>
              <OptionIcon>
                <FaImages />
              </OptionIcon>
              Galerie
            </OptionButton>
            <OptionButton onClick={openCameraModal}>
              <OptionIcon>
                <FaCamera />
              </OptionIcon>
              Prendre une photo
            </OptionButton>
            <Button onClick={() => setOptionsCardVisible(false)}>
              Annuler
            </Button>
          </OptionsCard>
        )}
      </Card>
<Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  style={{
    content: {
      width: '300px',
      height: '350px',
      margin: 'auto',
      borderRadius: '20px',
      zIndex: 2000, // ← ajoute ceci
    },
    overlay: {
      zIndex: 1999, // ← et ceci pour le fond assombri
    }
  }}
>
        <AnimatedModalContent>
          <CloseButton onClick={closeModal}>
            <FaTimes />
          </CloseButton>
          <h2>Options de photo de profil</h2>
          {file && <ModalPreviewImage src={file} alt="Preview" />}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
            <ModalButton onClick={() => handleOption('edit')}>
              <ButtonIcon>
                <FaPencilAlt />
              </ButtonIcon>
              Modifier
            </ModalButton>
            <ModalButton onClick={() => handleOption('delete')}>
              <ButtonIcon>
                <FaTrash />
              </ButtonIcon>
              Supprimer
            </ModalButton>
            <ModalButton onClick={() => handleOption('camera')}>
              <ButtonIcon>
                <FaCamera />
              </ButtonIcon>
              Prendre une photo
            </ModalButton>
          </div>
        </AnimatedModalContent>
      </Modal>
      <Modal isOpen={cameraModalIsOpen} onRequestClose={closeCameraModal} style={{ content: { width: '300px', height: '400px', margin: 'auto' } }}>
        <AnimatedModalContent>
          <CloseButton onClick={closeCameraModal}>
            <FaTimes />
          </CloseButton>
          <h2>Prendre une photo</h2>
          <CameraContainer>
            <video ref={videoRef} autoPlay style={{ width: '100%', height: 'auto' }}></video>
            <canvas ref={canvasRef} style={{ display: 'none' }} width="300" height="225"></canvas>
            <ModalButton onClick={capturePhoto}>Capturer</ModalButton>
          </CameraContainer>
        </AnimatedModalContent>
      </Modal>
      {editModalIsOpen && (
       <EditCard>
       <CloseButton onClick={closeEditModal}>
         <FaTimes />
       </CloseButton>
       <Title>Modifier la photo de profil</Title>
       {originalFile && (
         <div style={{ position: 'relative', width: '100%', height: 200 }}>
           <Cropper
             image={originalFile}
             crop={crop}
             zoom={zoom}
             aspect={1}
             onCropChange={handleCropChange}
             onZoomChange={handleZoomChange}
             onCropComplete={onCropComplete}
             style={{
               containerStyle: {
                 filter: `
                   brightness(${brightness}%)
                   contrast(${contrast}%)
                   saturate(${saturation}%)
                   sepia(${sepia}%)
                 `,
               },
             }}
           />
         </div>
       )}
       <FilterControls>
         <div>
           <label>Luminosité</label>
           <FilterSlider
             type="range"
             min="50"
             max="150"
             step="10"
             value={brightness}
             onChange={(e) => setBrightness(e.target.value)}
           />
         </div>
         <div>
           <label>Contraste</label>
           <FilterSlider
             type="range"
             min="50"
             max="150"
             step="10"
             value={contrast}
             onChange={(e) => setContrast(e.target.value)}
           />
         </div>
         <div>
           <label>Saturation</label>
           <FilterSlider
             type="range"
             min="50"
             max="150"
             step="10"
             value={saturation}
             onChange={(e) => setSaturation(e.target.value)}
           />
         </div>
         <div>
           <label>Sépia</label>
           <FilterSlider
             type="range"
             min="0"
             max="100"
             step="10"
             value={sepia}
             onChange={(e) => setSepia(e.target.value)}
           />
         </div>
       </FilterControls>
       <ButtonContainer>
         <ChangeButton onClick={open}>
           <PencilIcon />
           Changer
         </ChangeButton>
         <Button onClick={handleSave}>Enregistrer</Button>
       </ButtonContainer>
     </EditCard>
     
      )}
      <FilterGridContainer>
        {styles.map((style) => (
          <div key={style.id} style={{ position: 'relative', cursor: 'pointer', width: '100%' }} onClick={() => handleStyleSelect(style.id)}>
            <StyleCard>
              <StyleImage src={filteredImages[style.id]} alt={style.name} />
              <StyleNameOverlay>{style.name}</StyleNameOverlay>
            </StyleCard>
          </div>
        ))}
      </FilterGridContainer>
    </Background>
  );
};

export default ProfileSetup;
