const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();

// Route pour l'inscription
router.post('/signup', authController.signup);

// Route pour la connexion
router.post('/login', (req, res) => {
    res.json({ message: 'Login endpoint' });
  });

module.exports = router;
