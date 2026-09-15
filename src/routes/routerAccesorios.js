import { Router } from "express";
import controllerAccesorios from '../controllers/controllerAccesorios.js';
import { uploadSingleImage } from '../middleware/upload.js';

const routerAccesorios = Router();
routerAccesorios.post('/', controllerAccesorios.createAccesorio);
routerAccesorios.get('/:id', controllerAccesorios.readAccesorioId);
routerAccesorios.get('/', controllerAccesorios.readAccesorios);
routerAccesorios.put('/:id', uploadSingleImage, controllerAccesorios.updateAccesorio);

export default routerAccesorios;