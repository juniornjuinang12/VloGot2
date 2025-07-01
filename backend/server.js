const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Charger les variables d'environnement
const jwt = require('jsonwebtoken'); // Importez le package jsonwebtoken
const authenticateToken = require('./authMiddleware');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/Vlog-Data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  emailOrPhone: String,
  firstName: String,
  lastName: String,
  password: String,
  day: Number,
  month: Number,
  year: Number,
  gender: String,
  customGender: String,
  greetingPreference: String,
  emailVerified: { type: Boolean, default: false },
  verificationCode: String,
  verificationCodeExpires: Date,
  resendCodeAttempts: { type: Number, default: 0 }, // Ajouter un champ pour compter les tentatives de renvoi
  lastResendCodeAttempt: Date, // Ajouter un champ pour enregistrer la dernière tentative de renvoi
  username: String, // Nouveau champ pour le pseudo
  profileImage: String, // Nouveau champ pour l'image de profil
  vlogDescription: { type: String, default: '' }, // Champ pour stocker la description du vlog
});

const User = mongoose.model('User', userSchema);

console.log('Email:', process.env.EMAIL_USER); // Vérifiez que les variables d'environnement sont correctement chargées
console.log('Password:', process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Correspond à EMAIL_USER dans .env
    pass: process.env.EMAIL_PASS,  // Correspond à EMAIL_PASS dans .env
  },
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Génère un code à 6 chiffres
};

const sendVerificationEmail = (email, code) => {
  console.log('Sending verification email to:', email); // Ajoutez ce log

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>Welcome to Our Service</h2>
        <p>Thank you for signing up!</p>
        <img src="https://cdn3.iconfinder.com/data/icons/letters-and-numbers-1/32/letter_V_blue-1024.png" alt="Logo" style="width: 100px; height: auto;"/>
        <h3>Your verification code is:</h3>
        <h1 style="letter-spacing: 5px;">${code}</h1>
        <p>Thank you,</p>
        <p>The Team</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Ajoutez ceci dans votre fichier backend
app.post('/api/saveContent', authenticateToken, async (req, res) => {
  const { content } = req.body; // Récupérer le contenu envoyé depuis le frontend
  try {
    const user = await User.findById(req.user.userId); // Trouver l'utilisateur connecté grâce au token
    if (!user) {
      console.error('Utilisateur introuvable avec l\'ID:', req.user.userId);
      return res.status(404).send('User not found');
    }

    user.vlogDescription = content; // Supposons que vous ayez un champ "vlogDescription" dans le schéma User
    await user.save(); // Sauvegarder les modifications
    console.log(`Contenu sauvegardé pour l'utilisateur ${user._id}: ${content}`); // Log du contenu enregistré
    res.status(200).send('Content saved successfully');
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement dans la base de données:', err);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/api/register', async (req, res) => {
  const { emailOrPhone, firstName, lastName, password, day, month, year, gender, customGender, greetingPreference } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 3600000); // Code valable pendant 1 heure

    const newUser = new User({
      emailOrPhone,
      firstName,
      lastName,
      password: hashedPassword,
      day,
      month,
      year,
      gender,
      customGender,
      greetingPreference,
      verificationCode,
      verificationCodeExpires,
    });

    await newUser.save();

    if (!/^\d+$/.test(emailOrPhone)) {
      sendVerificationEmail(emailOrPhone, verificationCode);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Exclure le mot de passe et les informations sensibles avant de renvoyer l'utilisateur
    const { password: userPassword, verificationCode: userVerificationCode, verificationCodeExpires: userVerificationCodeExpires, ...userData } = newUser._doc;

    // Envoyer le token et les données utilisateur dans une seule réponse
    res.status(200).json({ ...userData, token });
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/update-profile', authenticateToken, async (req, res) => {
  console.log('Request received for updating profile:', req.body); // Ajoute ce log
  const { username, profileImage } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    console.log('User found:', user); // Log l'utilisateur trouvé
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.username = username;
    user.profileImage = profileImage;

    await user.save();

    res.status(200).send('Profile updated successfully');
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/verify-email', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ emailOrPhone: email, verificationCode: code });

    if (!user) {
      return res.status(400).send('Invalid code or email');
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).send('Verification code has expired');
    }

    user.emailVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    user.resendCodeAttempts = 0; // Réinitialiser les tentatives de renvoi après vérification réussie
    user.lastResendCodeAttempt = undefined; // Réinitialiser la dernière tentative de renvoi
    await user.save();

    res.status(200).send('Email verified successfully');
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/resend-code', async (req, res) => {
  const { email } = req.body;
  console.log('Resend code request for email:', email); // Ajoutez ce log

  try {
    const user = await User.findOne({ emailOrPhone: email });
    console.log('User found:', user);

    if (!user) {
      return res.status(400).send('User not found');
    }

    const currentTime = new Date();
    const oneHourAgo = new Date(currentTime.getTime() - 3600000);

    // Vérifiez si les tentatives de renvoi dépassent la limite
    if (user.lastResendCodeAttempt && user.lastResendCodeAttempt > oneHourAgo && user.resendCodeAttempts >= 5) {
      return res.status(429).send('Too many resend attempts. Please try again later.');
    }

    if (!user.lastResendCodeAttempt || user.lastResendCodeAttempt <= oneHourAgo) {
      user.resendCodeAttempts = 0; // Réinitialiser les tentatives de renvoi après une heure
    }

    user.resendCodeAttempts += 1;
    user.lastResendCodeAttempt = currentTime;

    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 3600000); // Code valable pendant 1 heure

    await user.save();

    console.log('Sending email to:', user.emailOrPhone); // Utilisez user.emailOrPhone
    sendVerificationEmail(user.emailOrPhone, verificationCode); // Utilisez user.emailOrPhone

    res.status(200).send('Verification code resent successfully.');
  } catch (err) {
    console.error('Error resending verification code:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/get-email/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({ email: user.emailOrPhone });
  } catch (err) {
    console.error('Error fetching user email:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
