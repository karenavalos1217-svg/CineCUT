// web_services/src/routes/api/peliculas.js
const express = require('express');
const router = express.Router();

const { auth } = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/roles');
const ctrl = require('../../controllers/peliculaControllers');

// Público
router.get('/peliculas', ctrl.list);
router.get('/peliculas/:id', ctrl.getOne);

// Admin
router.post('/peliculas', auth, requireAdmin, ctrl.create);
router.put('/peliculas/:id', auth, requireAdmin, ctrl.update);
router.delete('/peliculas/:id', auth, requireAdmin, ctrl.remove);

module.exports = router; // <— IMPORTANTE
