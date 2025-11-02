/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registrar usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Usuario registrado
 *       409:
 *         description: Email ya registrado
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: OK (devuelve token)
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserPublic'
 *       401:
 *         description: No autenticado
 */

const express = require('express');
const router = express.Router();

const authCtrl = require('../../controllers/auth.controller');
const { auth } = require('../../middlewares/auth.middleware'); // agrega req.user

// Registro / Login 
router.post('/register', authCtrl.register);
router.post('/login',    authCtrl.login);

//  Perfil del usuario autenticado 
router.get('/perfil', auth, authCtrl.me);         
router.put('/perfil', auth, authCtrl.updateMe);

// temporales mientras migro clientes
router.get('/me',  auth, authCtrl.me);
router.put('/me',  auth, authCtrl.updateMe);

// Recuperación de contraseña
router.post('/recuperar',   authCtrl.forgotPassword);
router.post('/restablecer', authCtrl.resetPassword);

module.exports = router;
