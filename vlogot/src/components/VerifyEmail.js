import React, { useState, useEffect } from 'react';
import { Mail, Send, CheckCircle, Sparkles, ArrowRight, ShieldCheck, X } from 'lucide-react';
import styles from './VerifyEmail.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_API || 'http://localhost:5000';

const VerifyEmail = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || '';

  // Génération des particules flottantes
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2,
      });
    }
    setParticles(newParticles);
  }, []);

  const inactive = code.join('').length !== 6;

  const handleChange = (index, value) => {
    // Gestion du collage de code complet
    if (value.length > 1) {
      const chars = value.replace(/\D/g, '').slice(0, 6).split('');
      if (chars.length) {
        const newCode = [...code];
        for (let i = 0; i < 6; i++) {
          newCode[i] = chars[i] || '';
        }
        setCode(newCode);
        // Focus sur la dernière case remplie
        const lastIdx = Math.min(chars.length - 1, 5);
        setTimeout(() => {
          const nextInput = document.getElementById(`code-${lastIdx}`);
          if (nextInput) nextInput.focus();
        }, 0);
      }
      return;
    }
    if (!/^\d?$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    // Auto-focus sur le champ suivant
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');

    // 1) Pas encore 6 chiffres → on ne déclenche PAS d’erreur texte,
    //    on ouvre simplement la modal et on sort.
    if (fullCode.length !== 6) {
      setShowModal(true);
      return;
    }

    // 2) On a 6 chiffres → on tente la vérif back-end
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode })
      });

      if (!res.ok) {
        // 2-a) Cas le plus courant : code faux → 400
        if (res.status === 400) {
          setError('Code incorrect');
          toast.error('Code incorrect', { theme: 'dark' });
          setTimeout(() => setError(''), 2500);
        } else {
          // 2-b) Autre erreur serveur
          const msg = await res.text();
          setError(msg || 'Erreur serveur');
          toast.error('Erreur de vérification', { theme: 'dark' });
        }
        return;
      }

      // 3) Succès
      toast.success('Code vérifié !', { theme: 'dark' });
      setShowSuccess(true);
      navigate('/profile-setup');
    } catch (err) {
      setError('Impossible de contacter le serveur');
      toast.error('Erreur réseau', { theme: 'dark' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true); setResendMessage('');
    try {
      const res = await fetch(`${API_URL}/api/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error(await res.text());
      setResendMessage('Le code de vérification a été renvoyé !');
      toast.info('Code renvoyé !', { theme: 'dark' });
    } catch (err) {
      setResendMessage(`Erreur : ${err.message}`);
      toast.error('Échec envoi du code', { theme: 'dark' });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{ background: "linear-gradient(to bottom, #87CEEB, #4682B4)" }}>
      <ToastContainer />
      {/* Particules flottantes animées */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full bg-white opacity-20 ${styles.animateFloat}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}

      {/* Effets de lumière */}
      <div className="absolute inset-0">
        {/* Supprime toutes les taches */}
        {/* <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" /> */}
        {/* <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{ animationDelay: '1s' }} /> */}
        {/* <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20" style={{ animationDelay: '2s' }} /> */}
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Carte principale avec effet glassmorphism */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl transform transition-all duration-500">
            {/* Animation de succès */}
            {/* SUPPRIMER la couche verte de succès qui recouvre la carte */}
            {/* 
            {showSuccess && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-green-500/20 backdrop-blur-xl">
                <div className="text-center animate-bounce">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-white text-xl font-semibold">Vérification réussie !</p>
                </div>
              </div>
            )} */}

            {/* Icône animée */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                {/* Signal renforcé : couleur plus vive */}
                <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-40"></div>
                <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                  <Mail className="w-10 h-10 text-white animate-pulse" />
                </div>
                {/* Applique la nouvelle animation floatStar à l'étoile */}
                <Sparkles
                  className={`absolute -top-2 -right-2 w-6 h-6 text-yellow-400 ${styles.floatStar}`}
                />
              </div>
            </div>

            {/* Titre avec effet gradient */}
            <h1 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Vérifiez votre email
            </h1>

            <p className="text-white/80 text-center mb-8 leading-relaxed">
              Nous avons envoyé un code de vérification à<br />
              <span className="text-blue-300 font-semibold">{email || 'votre adresse e-mail'}</span>
            </p>

            {/* Champs de code avec animations */}
            <div className="space-y-6">
              <div className="flex justify-center space-x-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onPaste={e => handleChange(index, e.clipboardData.getData('Text'))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength="1"
                    className="w-12 h-12 text-center text-xl font-bold bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/50 focus:border-blue-400 focus:bg-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 transform focus:scale-110"
                    placeholder="0"
                  />
                ))}
              </div>

              {/* Bouton de vérification avec animation */}
              <button
                onClick={handleSubmit}
                className={
                  `w-full relative group overflow-hidden
                   ${inactive
                     ? 'bg-gray-500 cursor-not-allowed opacity-60'
                     : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
                   text-white font-semibold py-4 px-6 rounded-xl
                   transition-all duration-300 transform
                   ${inactive ? '' : 'hover:scale-105 focus:ring-4 focus:ring-blue-400/50'}`
                }
                disabled={isLoading}
              >
{ !inactive && (
  <span
    className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/0
               -translate-x-full group-hover:translate-x-full
               transition-transform duration-700 pointer-events-none" />
)}
                <span className="relative flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Vérification...</span>
                    </>
                  ) : (
                    <>
                      <span>Vérifier</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Message d'erreur avec animation */}
            {error && (
              <div className={`mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl backdrop-blur-sm ${styles.animateShake}`}>
                <p className="text-red-300 text-center text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Carte de renvoi avec effet hover */}
          <div className="mt-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 group">
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 text-white/80 hover:text-white transition-colors duration-300 disabled:opacity-50"
            >
              <Send className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Vous n'avez pas reçu le code ? Cliquez pour renvoyer</span>
            </button>

            {/* Message de succès du renvoi */}
            {resendMessage && (
              <div className={`mt-3 p-2 bg-green-500/20 border border-green-400/30 rounded-lg backdrop-blur-sm ${styles.animateFadeIn}`}>
                <p className="text-green-300 text-center text-sm">{resendMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Code requis */}
      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40`}
          onClick={() => setShowModal(false)}
        >
          <div
            className={`relative w-11/12 max-w-sm p-6 rounded-2xl
                        bg-white/10 border border-white/25 backdrop-blur-xl text-center
                        ${styles.modalAppear}`}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white/80 hover:text-white"
            >
              <X size={22} />
            </button>
            <ShieldCheck size={48} className="mx-auto mb-3 text-yellow-400" />
            <h3 className="text-lg font-semibold text-white mb-1">Code requis</h3>
            <p className="text-sm text-gray-200">
              Veuillez d&rsquo;abord saisir les 6&nbsp;chiffres avant de valider.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;