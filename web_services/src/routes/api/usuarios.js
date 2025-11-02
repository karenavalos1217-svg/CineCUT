const router = express.Router();
const { auth } = require('../../middlewares/auth.middleware');
const usuarioController = require('../../controllers/usuario.controller'); //COLOCA ASI TODOS LOS CONTROLLERS KAREN CARPETA (CONTROLLERS)
/*COLOCA ASI TODOS LOS CONTROLLERS KAREN, CARPETA (controllers)
ARCHIVOS (sala.controller, pelicula.controller...etc )*/

// Protegidas con auth
router.use(auth);

// Perfil del usuario autenticado
router.get('/perfil', usuarioController.getPerfil);
router.put('/perfil', usuarioController.updatePerfil);
router.put('/cambiar-password', usuarioController.cambiarPassword);

module.exports = router;