// src/routes/api/auth.route.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');

router.post('/registrar', authController.registrar);
router.post('/login', authController.iniciarSesion);
router.post('/olvido-password', authController.olvidoPassword);
router.post('/restablecer-password', authController.restablecerPassword);

module.exports = router;
