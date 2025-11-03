// src/routes/api/user.route.js
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const { auth } = require('../../middlewares/auth.middleware');

router.get('/perfil', auth, userController.obtenerPerfil);
router.put('/perfil', auth, userController.actualizarPerfil);
router.put('/cambiar-password', auth, userController.cambiarPassword);

module.exports = router;
