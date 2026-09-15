import { uploadSingleImage } from '../middleware/upload.js';
import modelMotos from '../models/modelMotos.js';
import fs from 'fs';
import path from 'path';

const controllerMotos = {
    createMoto: async (sol, res) => {
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

                const newMoto = new modelMotos({
                    modelo: sol.body.modelo,
                    marca: sol.body.marca,
                    referencia: sol.body.referencia,
                    cilindraje: sol.body.cilindraje,
                    precio: sol.body.precio,
                    stock: sol.body.stock,
                    imagen: sol.file.filename
                });

                const savedMoto = await newMoto.save();

                res.json({
                    result: 'fine',
                    message: 'Moto creada',
                    data: savedMoto,
                });
            });
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred creating the moto',
                data: error,
            });
        }
    },

    readMotoId: async (sol, res) => {
        try {
            const motoFound = await modelMotos.findById(sol.params.id);

            if (!motoFound) {
                return res.status(404).json({
                    result: 'mistake',
                    message: 'Moto no encontrada',
                    data: null,
                });
            }

            if (motoFound._id) {
                return res.json({
                    result: 'fine',
                    message: 'Moto consultada',
                    data: motoFound,
                });
            }
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al consultar la moto por su identificador',
                data: error,
            });
        }
    },

    readMotos: async (sol, res) => {
        try {
            const allMotosFound = await modelMotos.find();
            res.json({
                result: 'fine',
                message: 'Motos consultadas',
                data: allMotosFound,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al consultar las motos',
                data: error,
            });
        }
    },

    updateMoto: async (sol, res) => {
        try {
            const { id } = sol.params;

            const motoExistente = await modelMotos.findById(id);

            if (!motoExistente) {
                if (sol.file) {
                    fs.unlinkSync(sol.file.path);
                }

                return res.status(404).json({
                    result: 'mistake',
                    message: 'Moto no encontrada',
                    data: null,
                });
            }

            if (sol.file) {
                if (motoExistente.imagen) {
                    const rutaImagenAntigua = path.join('imagenes', motoExistente.imagen);

                    if (fs.existsSync(rutaImagenAntigua)) {
                        fs.unlinkSync(rutaImagenAntigua);
                    }
                }
            }

            const nuevosDatos = {
                modelo: sol.body.modelo,
                marca: sol.body.marca,
                referencia: sol.body.referencia,
                cilindraje: sol.body.cilindraje,
                precio: sol.body.precio,
                stock: sol.body.stock,
                imagen: sol.file ? sol.file.filename : motoExistente.imagen,
            };

            const motoActualizada = await modelMotos.findByIdAndUpdate(
                id,
                nuevosDatos,
                { new: true }
            );

            return res.json({
                result: 'fine',
                message: 'Moto actualizada correctamente',
                data: motoActualizada,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al actualizar la moto',
                data: error.message || error,
            });
        }
    },

}

export default controllerMotos;