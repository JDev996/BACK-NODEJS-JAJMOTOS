import { Router } from "express";
import controllerRepuestos from '../controllers/controllerRepuestos.js';
import { uploadSingleImage } from '../middleware/upload.js';

const routerRespuestos = Router();
routerRespuestos.post('/', controllerRepuestos.createRepuesto);
routerRespuestos.get('/:id', controllerRepuestos.readRepuestoId);
routerRespuestos.get('/', controllerRepuestos.readRepuestos);
routerRespuestos.put('/:id', uploadSingleImage, controllerRepuestos.updateRepuesto);
routerRespuestos.delete('/:id', controllerRepuestos.deleteRepuesto);

export default routerRespuestos;
