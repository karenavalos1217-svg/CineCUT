const express = require('express');
require('dotenv').config();

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const sequelize = require('./config/db');
const routes = require('./routes');

// Si necesitas el modelo Recorrido en este archivo:
const Recorrido = require('./models/usermodels.js'); //  antes apuntaba a userModels.js

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

morgan.token('ua', req => req.get('User-Agent'));
app.use(morgan(':method :url :status :response-time ms - :ua'));


const logsDir = path.join(__dirname, '../Logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
// (Opcional) Archivo separado para errores HTTP (4xx/5xx)
const errorLogStream  = fs.createWriteStream(path.join(logsDir, 'error.log'),  { flags: 'a' });

// 1) Log en consola: 'dev' en desarrollo, 'combined' en producción
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));          // conciso y con colores
} else {
  app.use(morgan('combined'));     // formato estándar de servidores
}

// 2) Log a archivo (siempre): formato completo
app.use(morgan('combined', { stream: accessLogStream }));

// 3) (Opcional) Solo errores a error.log (≥ 400)
app.use(morgan('combined', {
  stream: errorLogStream,
  skip: (_req, res) => res.statusCode < 400
}));

// monta rutas
app.use(routes.unprotectedroutes);
app.use('/api', routes.usuariosRoutes);

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
