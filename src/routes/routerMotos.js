import { Router } from "express";
import controllerMotos from '../controllers/controllerMotos.js';
import { uploadSingleImage } from '../middleware/upload.js';

const routerMotos = Router();
routerMotos.post('/', controllerMotos.createMoto);
routerMotos.get('/:id', controllerMotos.readMotoId);
routerMotos.get('/', controllerMotos.readMotos);
routerMotos.put('/:id', uploadSingleImage, controllerMotos.updateMoto);

export default routerMotos;
