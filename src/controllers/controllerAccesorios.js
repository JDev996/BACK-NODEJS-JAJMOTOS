import { uploadSingleImage } from '../middleware/upload.js';
import modelAccesorios from '../models/modelAccesorios.js';
import fs from 'fs';
import path from 'path';

const controllerAccesorios = {
    createAccesorio: async (sol, res) => {
        try {
            uploadSingleImage(sol, res, async (error) => {
                if (error) {
                    return res.json({
                        result: 'mistake',
                        message: 'Ocurrio un error al cargar la imagen',
                        data: error,
                    });
                }

                if (!sol.file) {
                    return res.json({
                        result: 'mistake',
                        message: 'La imagen es obligatoria',
                        data: null,
                    });
                }

                const newAccesorio = new modelAccesorios({
                    marca: sol.body.marca,
                    referencia: sol.body.referencia,
                    precio: sol.body.precio,
                    stock: sol.body.stock,
                    imagen: sol.file.filename
                });

                const savedAccesorio = await newAccesorio.save();

                res.json({
                    result: 'fine',
                    message: 'Accesorio creado',
                    data: savedAccesorio,
                });
            });
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred creating the accesorio',
                data: error,
            });
        }
    },

    readAccesorioId: async (sol, res) => {
        try {
            const accesorioFound = await modelAccesorios.findById(sol.params.id);

            if (!accesorioFound) {
                return res.status(404).json({
                    result: 'mistake',
                    message: 'Accesorio no encontrado',
                    data: null,
                });
            }

            return res.json({
                result: 'fine',
                message: 'Accesorio consultado',
                data: accesorioFound,
            });
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al consultar el accesorio por su identificador',
                data: error,
            });
        }
    },

    readAccesorios: async (sol, res) => {
        try {
            const allAccesoriosFound = await modelAccesorios.find();
            res.json({
                result: 'fine',
                message: 'Accesorios consultados',
                data: allAccesoriosFound,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al consultar los accesorios',
                data: error,
            });
        }
    },

    updateAccesorio: async (sol, res) => {
        try {
            const { id } = sol.params;
            const accesorioExistente = await modelAccesorios.findById(id);

            if (!accesorioExistente) {
                if (sol.file) {
                    fs.unlinkSync(sol.file.path);
                }

                return res.status(404).json({
                    result: 'mistake',
                    message: 'Accesorio no encontrado',
                    data: null,
                });
            }

            if (sol.file && accesorioExistente.imagen) {
                const rutaImagenAntigua = path.join('imagenes', accesorioExistente.imagen);

                if (fs.existsSync(rutaImagenAntigua)) {
                    fs.unlinkSync(rutaImagenAntigua);
                }
            }

            const nuevosDatos = {
                marca: sol.body.marca,
                referencia: sol.body.referencia,
                precio: sol.body.precio,
                stock: sol.body.stock,
                imagen: sol.file ? sol.file.filename : accesorioExistente.imagen,
            };

            const accesorioActualizado = await modelAccesorios.findByIdAndUpdate(
                id,
                nuevosDatos,
                { new: true, runValidators: true }
            );

            return res.json({
                result: 'fine',
                message: 'Accesorio actualizado correctamente',
                data: accesorioActualizado,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al actualizar el accesorio',
                data: error.message || error,
            });
        }
    },

};

export default controllerAccesorios;
