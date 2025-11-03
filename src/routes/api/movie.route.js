// src/routes/api/movie.route.js
const express = require('express');
const router = express.Router();
const movieController = require('../../controllers/movie.controller');
const { auth } = require('../../middlewares/auth.middleware');
const { requiereAdmin } = require('../../middlewares/role.middleware');

// Públicas
router.get('/', movieController.listar);
router.get('/:id', movieController.obtenerUna);

// Admin
router.post('/', auth, requiereAdmin, movieController.crear);
router.put('/:id', auth, requiereAdmin, movieController.actualizar);
router.delete('/:id', auth, requiereAdmin, movieController.eliminar);

module.exports = router;
