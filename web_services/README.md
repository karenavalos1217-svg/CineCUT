{
  "nombre": "Oliver",
  "email": "dani@example.com",
  "password": "98765" "NuevaSegura123"
}

{
  "nombre": "admin",
  "email": "cinecut@admin.com",
  "password": "12345"
}

PELICULAS
GET http://localhost:3000/api/peliculas?q=inter

GET http://localhost:3000/api/peliculas?genero=Sci-Fi
GET http://localhost:3000/apipeliculas?genero=Sci-Fi,Drama

GET http://localhost:3000/api/peliculas?clasificacion=PG-13
GET http://localhost:3000/api/peliculas?clasificacion=PG-13,R

GET http://localhost:3000/api/peliculas?anio=2014

GET http://localhost:3000/api/peliculas?q=nolan&genero=Sci-Fi&clasificacion=PG-13&anioDesde=2010&anioHasta=2020

SALAS
GET http://localhost:3000/api/salas

POST http://localhost:3000/api/salas
{ 
"nombre": "Sala 1", 
"numero": 1, 
"capacidad": 120, 
"tipo": "2D", 
"activa": true 
}

PUT http://localhost:3000/api/salas/idsala
{ 
"capacidad": 140, 
"tipo": "3D" 
}


POST http://localhost:3000/api/funciones
Body JSON:
{
  "peliculaId": 1,
  "salaId": 1,
  "inicio": "2025-10-15T19:00:00Z",
  "precio": 80
}

LISTAR PUBLICO
GET /api/funciones?desde=2025-10-15&hasta=2025-10-16
GET /api/funciones?peliculaId=1
GET /api/funciones?salaId=2&estado=activ

GET /api/funciones/1


ADMIN ACTIALIZAR
PUT /api/funciones/1
{ "inicio": "2025-10-15T21:30:00", "precio": 90 }

CANCELAR
DELETE /api/funciones/1