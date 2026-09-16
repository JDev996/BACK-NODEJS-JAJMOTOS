import { Router } from "express";
import controllerUsuario from '../controllers/controllerUsuario.js';
import { uploadSingleImage } from '../middleware/upload.js';

const routerUsuario = Router();
routerUsuario.post('/', controllerUsuario.createUsuario);
routerUsuario.get('/:id', controllerUsuario.readUsuario);
routerUsuario.get('/', controllerUsuario.readUsuarios);
routerUsuario.put('/:id', uploadSingleImage, controllerUsuario.updateUsuario);

export default routerUsuario;