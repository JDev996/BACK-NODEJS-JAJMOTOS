import { uploadSingleImage } from '../middleware/upload.js';
import modelAccesorios from '../models/modelAccesorios.js';
import fs from 'fs';
import path from 'path';

const controllerAccesorios = {
    createAccesorio: async (sol, res) => {
        try {
            uploadSingleImage(sol, res, async (error) => {
                if (error) {
                    return res.status(400).json({
                        result: 'mistake',
                        message: 'An error occurred while upload the image',
                        data: error,
                    });
                }

                if (!sol.file) {
                    return res.status(400).json({
                        result: 'mistake',
                        message: 'An image is required',
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
                    message: 'Accesorio created',
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
                    message: 'Accesorio not found',
                    data: null,
                });
            }

            return res.json({
                result: 'fine',
                message: 'Accesorio read',
                data: accesorioFound,
            });
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred reading the accesorio by Id',
                data: error,
            });
        }
    },

    readAccesorios: async (sol, res) => {
        try {
            const allAccesoriosFound = await modelAccesorios.find();
            res.json({
                result: 'fine',
                message: 'Accesorios read',
                data: allAccesoriosFound,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred reading the accesorios',
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
                    message: 'accesorio not found',
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
                message: 'accesorio updated successfully',
                data: accesorioActualizado,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred updating the accesorio',
                data: error.message || error,
            });
        }
    },

};

export default controllerAccesorios;
