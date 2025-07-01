import { motion } from 'framer-motion';
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import vlogLogo from '../assets/logo.png';
import './Register.css';
import { FcGoogle } from 'react-icons/fc'; 
import { FaFacebook, FaTwitter, FaApple } from 'react-icons/fa'; // Facebook, Twitter, Apple

const VloGotRegister = () => {
  const [country] = useState('France');
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  /* ------------------------------------------------------------------ */
  /* 1. Génération des éléments flottants                               */
  /* ------------------------------------------------------------------ */
  const floatingElements = useMemo(() => {
    const vElements = [...Array(50)].map((_, i) => ({
      id: i,
      delay: Math.random() * 10,
      x: Math.random() * 100,
      y: Math.random() * 100,
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));

    const bubbleElements = [...Array(30)].map((_, i) => ({
      id: i,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      x: Math.random() * 100,
    }));

    return { vElements, bubbleElements };
  }, []);

  /* ------------------------------------------------------------------ */
  /* 2. Déclenche l’apparition (ajout de .loaded)                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  /* ------------------------------------------------------------------ */
  /* 3. Sous-composant Bulles et “v” flottants                          */
  /* ------------------------------------------------------------------ */
  const FloatingElements = () => (
    <>
      {floatingElements.vElements.map((el) => (
        <div
          key={`v-${el.id}`}
          className="floating-v"
          style={{
            '--delay': `${el.delay}s`,
            '--duration': '6s',
            '--x': `${el.x}vw`,
            '--y': `${el.y}vh`,
            '--size': '16px',
            top: `${el.top}vh`,
            left: `${el.left}vw`,
          }}
        >
          v
        </div>
      ))}

      {floatingElements.bubbleElements.map((el) => (
        <div
          key={`bubble-${el.id}`}
          className="bubble"
          style={{
            '--delay': `${el.delay}s`,
            '--duration': `${el.duration}s`,
            '--x': `${el.x}vw`,
            '--size': '40px',
          }}
        >
          <span style={{ fontSize: 14, color: '#1E90FF' }}>v</span>
        </div>
      ))}
    </>
  );

  /* ------------------------------------------------------------------ */
  /* 4. Handlers                                                        */
  /* ------------------------------------------------------------------ */
  const handleSocialLogin = (platform) =>
    console.log(`Connexion avec ${platform}`);

  const handleEmailRegister = () => navigate('/email-register');

  /* ------------------------------------------------------------------ */
  /* 5. Rendu                                                           */
  /* ------------------------------------------------------------------ */
  return (
    <div className={`register-container ${isLoaded ? 'loaded' : ''}`}>
      {/* Logo fixe en haut à gauche */}
      <div className="logo-header">
        <div className="logo-text">VloGot</div>
      </div>

      {/* Carte principale */}
      <motion.div className="main-card" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div
          className="title"
          style={{ justifyContent: 'flex-start', gap: '0.5rem', marginLeft: 40 }}
        >
          <span>Rejoins VloGot</span>
          <img
            src={vlogLogo}
            alt="VloGot logo"
            style={{
              width: 38,
              height: 38,
              marginLeft: '0.5rem',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(30,144,255,0.10)',
              objectFit: 'contain',
            }}
          />
        </div>

    <motion.div className="social-buttons" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
  <button
    className="social-btn google-btn"
    onClick={() => handleSocialLogin('Google')}
  >
    <FcGoogle size={20} style={{ marginRight: 10 }} />
    Continuer avec Google
  </button>

  <button
    className="social-btn facebook-btn"
    onClick={() => handleSocialLogin('Facebook')}
  >
    <FaFacebook size={20} style={{ color: '#fff', marginRight: 10 }} />
    Continuer avec Facebook
  </button>

  <button
    className="social-btn twitter-btn"
    onClick={() => handleSocialLogin('Twitter')}
  >
    <FaTwitter size={20} style={{ color: '#fff', marginRight: 10 }} />
    Continuer avec Twitter
  </button>

  <button
    className="social-btn apple-btn"
    onClick={() => handleSocialLogin('Apple')}
  >
    <FaApple size={20} style={{ color: '#fff', marginRight: 10 }} />
    Continuer avec Apple
  </button>
</motion.div>


        <motion.div className="divider" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <span>OU</span>
        </motion.div>

        <motion.button className="email-btn" onClick={handleEmailRegister} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          ✉️ Inscription avec Email
        </motion.button>
      </motion.div>

      <p className="disclaimer">
        En continuant avec un compte VloGot basé en {country}, tu acceptes nos{' '}
        <a href="/terms">Conditions d'utilisation</a> et reconnais avoir lu notre{' '}
        <a href="/privacy">Politique de confidentialité</a>.
      </p>

      {/* Décorations animées */}
      <FloatingElements />
    </div>
  );
};

export default VloGotRegister;
