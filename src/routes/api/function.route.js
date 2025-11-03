// src/routes/api/function.route.js
const express = require('express');
const router = express.Router();
const functionController = require('../../controllers/function.controller');
const { auth } = require('../../middlewares/auth.middleware');
const { requiereAdmin } = require('../../middlewares/role.middleware');

router.get('/', functionController.listar);
router.get('/:id', functionController.obtenerUna);

router.post('/', auth, requiereAdmin, functionController.crear);
router.put('/:id', auth, requiereAdmin, functionController.actualizar);
router.delete('/:id', auth, requiereAdmin, functionController.eliminar);

module.exports = router;
