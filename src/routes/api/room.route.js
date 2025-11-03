// src/routes/api/room.route.js
const express = require('express');
const router = express.Router();
const roomController = require('../../controllers/room.controller');
const { auth } = require('../../middlewares/auth.middleware');
const { requiereAdmin } = require('../../middlewares/role.middleware');

router.get('/', roomController.listar);
router.get('/:id', roomController.obtenerUna);

router.post('/', auth, requiereAdmin, roomController.crear);
router.put('/:id', auth, requiereAdmin, roomController.actualizar);
router.delete('/:id', auth, requiereAdmin, roomController.eliminar);

module.exports = router;
