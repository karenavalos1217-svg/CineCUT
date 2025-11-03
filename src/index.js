// src/index.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const { sequelize, conectarDB } = require('./config/db');

const app = express();
const BASE = '/api/v1';

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Logs con morgan a archivo en producción
const logsDir = path.join(__dirname, 'Logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

if (process.env.ENTORNO === 'produccion') {
  const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

// Rutas
const authRoutes = require('./routes/api/auth.route');
const userRoutes = require('./routes/api/user.route');
const movieRoutes = require('./routes/api/movie.route');
const roomRoutes = require('./routes/api/room.route');
const functionRoutes = require('./routes/api/function.route');

app.use(`${BASE}/auth`, authRoutes);
app.use(`${BASE}/usuarios`, userRoutes);
app.use(`${BASE}/peliculas`, movieRoutes);
app.use(`${BASE}/salas`, roomRoutes);
app.use(`${BASE}/funciones`, functionRoutes);

app.get('/', (_, res) => res.json({ ok: true, msg: 'CineCUT API' }));

async function iniciarServidor() {
  await conectarDB();
  await sequelize.sync({ alter: true }); // mantener esquema actualizado en dev
  const puerto = Number(process.env.PUERTO) || 3000;
  app.listen(puerto, () => console.log(`🚀 Servidor escuchando en http://localhost:${puerto}${BASE}`));
}

iniciarServidor();
