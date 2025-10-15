const express = require('express');
require('dotenv').config();

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const sequelize = require('./config/db');
const routes = require('./routes');                 // { unprotectedroutes, usuariosRoutes }

// (opcional) solo si realmente lo necesitas aquí
const Recorrido = require('./models/usermodels.js');

// Routers nuevos
const peliculasRoutes = require('./routes/api/peliculas');
const salasRoutes     = require('./routes/api/salas');

const app  = express();
const BASE = process.env.BASE_URL || '/api';
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Morgan: token personalizado para UA
morgan.token('ua', req => req.get('User-Agent'));
app.use(morgan(':method :url :status :response-time ms - :ua'));

// Logs a archivos
const logsDir = path.join(__dirname, '../Logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
const errorLogStream  = fs.createWriteStream(path.join(logsDir, 'error.log'),  { flags: 'a' });

// Consola: dev en desarrollo, combined en prod
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Archivo: access y solo errores
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('combined', {
  stream: errorLogStream,
  skip: (_req, res) => res.statusCode < 400
}));

// ===== Montaje de rutas (usar SIEMPRE BASE) =====
app.use(routes.unprotectedroutes);      // este router interno puede montar /api por su cuenta
app.use(BASE, routes.usuariosRoutes);   // /api/usuarios (o lo que tengas dentro)
app.use(BASE, peliculasRoutes);         // /api/peliculas
app.use(BASE, salasRoutes);             // /api/salas
// ===============================================

async function startServer() {
  try {
    await sequelize.sync();
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
