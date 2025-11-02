const express = require('express');
const router = express.Router();
const {auth} = require('../../middlewares/auth.middleware');
const { requireAdmin} = require('../../middlewares/rol.middleware');
const ctrl = require('../../controllers/funcion.controller');

//publicas (Cartelera y detalles)
router.get('/funciones', ctrl.list);
router.get('/funciones/:id', ctrl.getOne);

//Admin
router.post('/funciones', auth, requireAdmin, ctrl.create);
router.put('/funciones/:id', auth, requireAdmin, ctrl.update);
router.delete('/funciones/:id', auth, requireAdmin, ctrl.remove);

module.exports = router;