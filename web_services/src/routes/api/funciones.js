const express = require('express');
const router = express.Router();
const {auth} = require('../../middleware/auth');
const { requireAdmin} = require('../../middleware/roles');
const ctrl = require('../../controllers/funcionControllers');

//publicas (Cartelera y detalles)
router.get('/funciones', ctrl.list);
router.get('/funciones/:id', ctrl.getOne);

//Admin
router.post('/funciones', auth, requireAdmin, ctrl.create);
router.put('/funciones/:id', auth, requireAdmin, ctrl.update);
router.delete('/funciones/:id', auth, requireAdmin, ctrl.remove);

module.exports = router;