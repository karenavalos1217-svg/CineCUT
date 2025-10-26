/**
 * @swagger
 * tags:
 *   name: Salas
 *   description: Gestión de salas de cine
 */

/**
 * @swagger
 * /salas:
 *   get:
 *     summary: Listar salas
 *     tags: [Salas]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Busca por nombre/tipo
 *       - in: query
 *         name: activa
 *         schema: { type: boolean }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *         description: numero:asc | capacidad:desc
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
 *     summary: Crear sala (admin)
 *     tags: [Salas]
 *     security: [ { BearerAuth: [] } ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalaCreate'
 *     responses:
 *       201: { description: Creada }
 */

/**
 * @swagger
 * /salas/{id}:
 *   get:
 *     summary: Obtener sala por id
 *     tags: [Salas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200: { description: OK }
 *   put:
 *     summary: Actualizar sala (admin)
 *     tags: [Salas]
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
 *             $ref: '#/components/schemas/SalaCreate'
 *     responses:
 *       200: { description: Actualizada }
 *   delete:
 *     summary: Eliminar sala (admin)
 *     tags: [Salas]
 *     security: [ { BearerAuth: [] } ]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: integer }
 *         required: true
 *     responses:
 *       200: { description: Eliminada }
 */


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
