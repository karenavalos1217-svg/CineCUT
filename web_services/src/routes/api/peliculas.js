/**
 * @swagger
 * tags:
 *   name: Peliculas
 *   description: Catálogo de películas
 */

/**
 * @swagger
 * /peliculas:
 *   get:
 *     summary: Listar películas
 *     tags: [Peliculas]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Búsqueda en título/sinopsis/director
 *       - in: query
 *         name: genero
 *         schema: { type: string }
 *         description: Uno o varios separados por coma (p.ej. Sci-Fi,Drama)
 *       - in: query
 *         name: clasificacion
 *         schema: { type: string }
 *       - in: query
 *         name: anio
 *         schema: { type: integer }
 *       - in: query
 *         name: anioDesde
 *         schema: { type: integer }
 *       - in: query
 *         name: anioHasta
 *         schema: { type: integer }
 *       - in: query
 *         name: disponible
 *         schema: { type: boolean }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *         description: Campo:orden (p.ej. anio:desc)
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: OK
 *   post:
 *     summary: Crear película (admin)
 *     tags: [Peliculas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PeliculaCreate'
 *     responses:
 *       201:
 *         description: Creada
 */

/**
 * @swagger
 * /peliculas/{id}:
 *   get:
 *     summary: Obtener película por id
 *     tags: [Peliculas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 *   put:
 *     summary: Actualizar película (admin)
 *     tags: [Peliculas]
 *     security: [ { BearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PeliculaCreate'
 *     responses:
 *       200: { description: Actualizada }
 *   delete:
 *     summary: Eliminar película (admin)
 *     tags: [Peliculas]
 *     security: [ { BearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200: { description: Eliminada }
 */

// web_services/src/routes/api/peliculas.js
const express = require('express');
const router = express.Router();

const { auth } = require('../../middlewares/auth.middleware');
const { requireAdmin } = require('../../middlewares/rol.middleware');
const ctrl = require('../../controllers/pelicula.controller');

// Público
router.get('/peliculas', ctrl.list);
router.get('/peliculas/:id', ctrl.getOne);

// Admin
router.post('/peliculas', auth, requireAdmin, ctrl.create);
router.put('/peliculas/:id', auth, requireAdmin, ctrl.update);
router.delete('/peliculas/:id', auth, requireAdmin, ctrl.remove);

module.exports = router; // <— IMPORTANTE
