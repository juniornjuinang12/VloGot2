import React, { useEffect, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from 'react-spinners/ClipLoader';
import './tippyCustom.css'; // Assurez-vous d'importer les styles personnalisés
import vlogLogo from '../assets/logo.png';
import styles from './EmailRegister.module.css';
import { UserContext } from '../contexts/UserContext'; // Importer le contexte utilisateur

const validationSchema = yup.object().shape({
  emailOrPhone: yup.string().required('Numéro de téléphone / Adresse email est requis'),
  firstName: yup.string().required('Prénom est requis'),
  lastName: yup.string().required('Nom est requis'),
  password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Mot de passe est requis'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Les mots de passe doivent correspondre').required('La confirmation du mot de passe est requise'),
  day: yup.number().min(1, 'Jour invalide').max(31, 'Jour invalide').required('Jour est requis'),
  month: yup.number().min(1, 'Mois invalide').max(12, 'Mois invalide').required('Mois est requis'),
  year: yup.number()
    .min(1900, 'Année invalide')
    .max(new Date().getFullYear(), 'Année invalide')
    .required('Année est requise')
    .test('age', 'Vous devez avoir au moins 13 ans', function (value) {
      const today = new Date();
      const birthDate = new Date(value, this.parent.month - 1, this.parent.day);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 13;
    }),
  gender: yup.string().oneOf(['homme', 'femme', 'ajuster'], 'Genre invalide').required('Genre est requis'),
  customGender: yup.string().when('gender', {
    is: 'ajuster',
    then: (schema) => schema.notRequired() // Marquer ce champ comme optionnel
  }),
  greetingPreference: yup.string().when('gender', {
    is: 'ajuster',
    then: (schema) => schema.oneOf(['il', 'elle', 'ne pas specifier'], 'Préférence de salutation invalide').required('Préférence de salutation est requise')
  })
});

const EmailRegister = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const { setUser } = useContext(UserContext); // Accéder à setUser pour mettre à jour l'utilisateur
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // État pour le chargement

  const selectedGender = watch('gender');

  useEffect(() => {
    Object.keys(errors).forEach((key) => {
      const element = document.querySelector(`[name="${key}"]`);
      if (element) {
        tippy(element, {
          content: errors[key]?.message,
          trigger: 'focus',
          placement: 'right',
          theme: 'custom'
        });
      }
    });
  }, [errors]);

  const onSubmit = async (data) => {
    setIsLoading(true); // Activer le chargement
    console.log('Données soumises :', data); // Vérifie les données soumises au formulaire
  
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      console.log('Réponse brute du serveur :', response); // Vérifie la réponse brute
  
      if (response.ok) {
        const userData = await response.json();
        console.log('Données utilisateur reçues du serveur :', userData); // Vérifie les données utilisateur reçues
  
        if (userData.token) {
          console.log('Token présent :', userData.token); // Vérifie si un token est présent
          localStorage.setItem('token', userData.token);
          setUser(userData); // Met à jour le contexte utilisateur
  
          // Ajouter un indicateur pour un nouvel utilisateur
          localStorage.setItem('isNewUser', 'true');
          toast.success("Inscription réussie ! Redirection...");
  
          if (/^\d+$/.test(userData.emailOrPhone)) {
            console.log('Navigation vers /verify-phone'); // Vérifie si la navigation vers /verify-phone est appelée
            navigate('/verify-phone');
          } else {
            console.log('Navigation vers /verify-email avec state :', { email: userData.emailOrPhone }); // Vérifie la navigation vers /verify-email
            navigate('/verify-email', { state: { email: userData.emailOrPhone } });
          }
        } else {
          console.error('Token manquant dans la réponse'); // Si le token est absent
          toast.error("Erreur: Token manquant dans la réponse du serveur.");
        }
      } else {
        const errorData = await response.json();
        console.error('Erreur du serveur, code HTTP :', response.status, 'Message :', errorData.message);
        toast.error(`Erreur d'inscription: ${errorData.message || 'Une erreur est survenue.'}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription :', error);
      toast.error("Erreur réseau ou serveur inaccessible.");
    } finally {
      setIsLoading(false); // Désactiver le chargement
    }
  };
   

  const handleKeyDown = (e, fieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    }
  };

  return (
    <div className={styles.emailRegisterContainer}>
      <div className={styles.floatingParticles}>
        {[...Array(25)].map((_, i) => (
          <div key={i} className={styles.particle}></div>
        ))}
      </div>

      <div className={`${styles.logoHeader} ${styles.fadeInUp}`}>
        <div className={styles.logoText}>VloGot</div>
        <img src={vlogLogo} alt="VloGot logo" className={styles.vlogLogo} />
      </div>

      <h1 className={`${styles.emailRegisterTitle} ${styles.fadeInUp}`}>Inscription avec Email</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={`${styles.emailRegisterForm} ${styles.fadeInUp}`}>
        <input
          type="text"
          placeholder="Numéro de téléphone / Adresse email"
          {...register('emailOrPhone')}
          className={`${styles.emailRegisterInput} ${errors.emailOrPhone ? styles.inputError : ''}`}
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <input
          type="text"
          placeholder="Prénom"
          {...register('firstName')}
          className={`${styles.emailRegisterInput} ${errors.firstName ? styles.inputError : ''}`}
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <input
          type="text"
          placeholder="Nom"
          {...register('lastName')}
          className={`${styles.emailRegisterInput} ${errors.lastName ? styles.inputError : ''}`}
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          {...register('password')}
          className={`${styles.emailRegisterInput} ${errors.password ? styles.inputError : ''}`}
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          {...register('confirmPassword')}
          className={`${styles.emailRegisterInput} ${errors.confirmPassword ? styles.inputError : ''}`}
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <div className={styles.dateOfBirth}>
          <select {...register('day')} className={`${styles.dateInput} ${errors.day ? styles.inputError : ''}`} onKeyDown={(e) => handleKeyDown(e)}>
            <option value="" disabled>Jour</option>
            {[...Array(31).keys()].map((d) => (
              <option key={d + 1} value={d + 1}>{d + 1}</option>
            ))}
          </select>

          <select {...register('month')} className={`${styles.dateInput} ${errors.month ? styles.inputError : ''}`} onKeyDown={(e) => handleKeyDown(e)}>
            <option value="" disabled>Mois</option>
            {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map((m, index) => (
              <option key={index + 1} value={index + 1}>{m}</option>
            ))}
          </select>

          <select {...register('year')} className={`${styles.dateInput} ${errors.year ? styles.inputError : ''}`} onKeyDown={(e) => handleKeyDown(e)}>
            <option value="" disabled>Année</option>
            {[...Array(100).keys()].map((y) => (
              <option key={2023 - y} value={2023 - y}>{2023 - y}</option>
            ))}
          </select>
        </div>

        <div className={styles.genderSelection}>
          <label>
            <input type="radio" value="homme" {...register('gender')} className={styles.radioInput} />
            <span className={styles.radioLabel}>Homme</span>
          </label>
          <label>
            <input type="radio" value="femme" {...register('gender')} className={styles.radioInput} />
            <span className={styles.radioLabel}>Femme</span>
          </label>
          <label>
            <input type="radio" value="ajuster" {...register('gender')} className={styles.radioInput} />
            <span className={styles.radioLabel}>Ajuster</span>
          </label>
        </div>
        {errors.gender && <p className={styles.errorMessage}>{errors.gender.message}</p>}

        {selectedGender === 'ajuster' && (
          <>
            <input
              type="text"
              placeholder="Genre ajusté (facultatif)"
              {...register('customGender')}
              className={`${styles.emailRegisterInput} ${errors.customGender ? styles.inputError : ''}`}
              onKeyDown={(e) => handleKeyDown(e)}
            />

            <select {...register('greetingPreference')} className={`${styles.dateInput} ${errors.greetingPreference ? styles.inputError : ''}`} onKeyDown={(e) => handleKeyDown(e)}>
              <option value="" disabled>Préférence de salutation</option>
              <option value="il">Dites lui bonjour (masculin)</option>
              <option value="elle">Dites lui bonjour (féminin)</option>
              <option value="ne pas specifier">Dites lui bonjour (ne pas spécifier)</option>
            </select>
          </>
        )}

        <button type="submit" className={styles.registerButton} disabled={isLoading}>
          {isLoading ? <ClipLoader color="#fff" size={20} /> : "S'inscrire"}
        </button>
      </form>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

      {/* Loading Overlay */}
      <div className={`${styles.loadingOverlay} ${isLoading ? styles.visible : ''}`}>
        <ClipLoader color="#1E90FF" size={50} />
      </div>
    </div>
  );
};

export default EmailRegister;
