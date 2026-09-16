import { Router } from "express";
import controllerVentas from '../controllers/controllerVentas.js';

const routerVentas = Router();
routerVentas.post('/', controllerVentas.createVenta);
routerVentas.get('/:id', controllerVentas.readVenta);
routerVentas.get('/', controllerVentas.readVentas);
routerVentas.put('/:id', controllerVentas.updateVenta);
routerVentas.delete('/:id', controllerVentas.deleteVenta);

export default routerVentas;