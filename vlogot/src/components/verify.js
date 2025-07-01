// routes/verify.js
const express = require('express');
const router = express.Router();
const VerificationCode = require('../models/VerificationCode');

router.post('/verify', async (req, res) => {
  const { emailOrPhone, code } = req.body;

  try {
    const verificationRecord = await VerificationCode.findOne({ emailOrPhone, code });

    if (!verificationRecord) {
      return res.status(400).send('Invalid verification code');
    }

    res.status(200).send('Verification successful');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
