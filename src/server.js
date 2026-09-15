import express from 'express';
import morgan from 'morgan';
import routerUsuario from './routes/routerUsuario.js';
import routerAccesorios from './routes/routerAccesorios.js';
import routerRespuestos from './routes/routerRespuestos.js';
import routerMotos from './routes/routerMotos.js';

const app = express();
app.use(morgan('con'));
app.use(express.json());
app.use('/usuarios', routerUsuario);
app.use('/accesorios', routerAccesorios);
app.use('/respuestos', routerRespuestos);
app.use('/motos', routerMotos);
app.get('/', (req, res) => {

    res.status(404).send("Not Found");

});

export default app;