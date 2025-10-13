const express = require('express');
const router = express.Router();
const authControllers = require('../../controllers/authControllers');
const { auth } = require('../../middleware/auth');
require('dotenv').config();

// Registro
router.post('/register', authControllers.register);

// Login (JWT)
router.post('/login', authControllers.login);

// Perfil (protegido)
router.get('/me', auth, authControllers.me);
router.put('/me', auth, authControllers.updateMe);

module.exports = router;
