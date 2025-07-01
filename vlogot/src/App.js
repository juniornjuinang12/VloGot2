// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import EmailRegister from './components/EmailRegister';
import Terms from './components/Terms';
import Privacy from './components/Privacy';
import { StyledEngineProvider } from '@mui/material/styles';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import VerifyEmail from './components/VerifyEmail';
import VerifyPhone from './components/VerifyPhone';
import "tippy.js/dist/tippy.css";
import ProfileSetup from './components/ProfileSetup';


function App() {
  return (
    <StyledEngineProvider injectFirst>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/email-register" element={<EmailRegister />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-phone" element={<VerifyPhone />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Router>
    </StyledEngineProvider>
  );
}

export default App;
