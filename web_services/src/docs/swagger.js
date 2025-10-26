const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

const PORT = process.env.PORT || 3000;
const BASE = process.env.BASE_URL || '/api';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CineCut API',
      version: '1.0.0',
      description: 'Documentación de la API de CineCut (Auth, Películas, Salas).',
    },
    servers: [
      { url: `http://localhost:${PORT}${BASE}`, description: 'Local' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ====== Películas ======
        Pelicula: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            titulo: { type: 'string' },
            sinopsis: { type: 'string', nullable: true },
            director: { type: 'string', nullable: true },
            genero: { type: 'string', example: 'Sci-Fi' },
            clasificacion: { type: 'string', example: 'PG-13' },
            anio: { type: 'integer', example: 2014 },
            duracionMin: { type: 'integer', example: 169 },
            posterUrl: { type: 'string', nullable: true },
            disponible: { type: 'boolean' }
          },
          required: ['titulo']
        },
        PeliculaCreate: {
          type: 'object',
          properties: {
            titulo: { type: 'string' },
            sinopsis: { type: 'string' },
            director: { type: 'string' },
            genero: { type: 'string' },
            clasificacion: { type: 'string' },
            anio: { type: 'integer' },
            duracionMin: { type: 'integer' },
            posterUrl: { type: 'string' },
            disponible: { type: 'boolean' }
          },
          required: ['titulo']
        },
        // ====== Salas ======
        Sala: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            numero: { type: 'integer' },
            capacidad: { type: 'integer' },
            tipo: { type: 'string', example: '2D' },
            activa: { type: 'boolean' }
          },
          required: ['nombre', 'numero', 'capacidad']
        },
        SalaCreate: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            numero: { type: 'integer' },
            capacidad: { type: 'integer' },
            tipo: { type: 'string' },
            activa: { type: 'boolean' }
          },
          required: ['nombre', 'numero', 'capacidad']
        },
        // ====== Auth / Usuario ======
        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', example: 'oli@example.com' },
            password: { type: 'string', example: 'Secreta123' }
          },
          required: ['email', 'password']
        },
        RegisterRequest: {
          type: 'object',
          properties: {
            nombre: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' }
          },
          required: ['nombre', 'email', 'password']
        },
        UserPublic: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            nombre: { type: 'string' },
            email: { type: 'string' },
            rol: { type: 'string', example: 'admin' }
          }
        }
      }
    }
  },
  // Escanea comentarios JSDoc en tus routers:
  apis: [
    path.join(__dirname, '../routes/**/*.js'),
  ],
};

module.exports = swaggerJsdoc(options);
