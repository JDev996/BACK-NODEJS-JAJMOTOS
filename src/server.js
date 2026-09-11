import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

const servidor = express();

servidor.use(morgan('dev'));
servidor.use(cors());
servidor.use(express.json());

servidor.get('/', (requerimiento, respuesta) => {
respuesta.status(404).send('no encontrado');
});

export default servidor;