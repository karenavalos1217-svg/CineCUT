const express = require('express');
const router = express.Router();

const { auth } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/roles');
const ctrl = require('../../controllers/salaControllers');

// Público (si prefieres, puedes proteger también estos dos)
router.get('/salas', ctrl.list);
router.get('/salas/:id', ctrl.getOne);

// Admin
router.post('/salas', auth, requireAdmin, ctrl.create);
router.put('/salas/:id', auth, requireAdmin, ctrl.update);
router.delete('/salas/:id', auth, requireAdmin, ctrl.remove);

module.exports = router;
