// Core y .env
const express = require('express');
require('dotenv').config();

const auth = require('./routes/api/auth');

// Swagger (UI + spec)
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// Logging y utilidades de archivos
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// BD y agregador de rutas
const sequelize = require('./config/db');
const routes = require('./routes');                // { unprotectedroutes, usuariosRoutes }

// (Opcional) solo si realmente lo usas en este archivo
// const Recorrido = require('./models/usermodels.js');

// Routers de dominio
const peliculasRoutes = require('./routes/api/peliculas');
const salasRoutes     = require('./routes/api/salas');
const funcionesRoutes = require('./routes/api/funciones');

// App, prefijo base y puerto
const app  = express();
const BASE = process.env.BASE_URL || '/api';
const PORT = process.env.PORT || 3000;

/* ===========================
   Middlewares globales
   =========================== */

// Body parser
app.use(express.json());

// Morgan: token personalizado para User-Agent
morgan.token('ua', req => req.get('User-Agent'));
// Log simple con UA (consola)
app.use(morgan(':method :url :status :response-time ms - :ua'));

// Carpeta de logs
const logsDir = path.join(__dirname, '../Logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

// Streams para logs a archivo
const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
const errorLogStream  = fs.createWriteStream(path.join(logsDir, 'error.log'),  { flags: 'a' });

// Log de consola según entorno
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Log a archivo (todas)
app.use(morgan('combined', { stream: accessLogStream }));
// Log a archivo (solo errores >= 400)
app.use(morgan('combined', {
  stream: errorLogStream,
  skip: (_req, res) => res.statusCode < 400
}));

/* ===========================
   Swagger
   =========================== */
app.use(`${BASE}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get(`${BASE}/docs.json`, (_req, res) => res.json(swaggerSpec));

/* ===========================
   Montaje de rutas
   =========================== */

app.use(BASE, auth);

// Público (ahí normalmente enganchas /register, /login, etc.)
app.use(routes.unprotectedroutes);

// Usuarios bajo /api (si lo usas para admin/otros)
app.use(BASE, routes.usuariosRoutes);

// Películas bajo /api
app.use(BASE, peliculasRoutes);

// Salas bajo /api
app.use(BASE, salasRoutes);

// Funciones bajo /api
app.use(BASE, funcionesRoutes);

/* ===========================
   Arranque del servidor
   =========================== */
async function startServer() {
  try {
    await sequelize.sync(); // crea/actualiza tablas si faltan
    console.log('DB is ready');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error al sincronizar la base de datos:', err);
    process.exit(1);
  }
}

startServer();
