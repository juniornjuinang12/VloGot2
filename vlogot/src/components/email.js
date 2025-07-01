const express = require('express');
const router = express.Router();
const VerificationCode = require('../models/VerificationCode');

router.post('/verify', async (req, res) => {
  const { emailOrPhone, code } = req.body;

  try {
    const verification = await VerificationCode.findOne({ emailOrPhone, code });

    if (!verification) {
      return res.status(400).send('Invalid verification code.');
    }

    // Code is valid, proceed with verification logic here

    res.status(200).send('Verification successful');
  } catch (err) {
    console.error('Error during verification:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
