import { uploadSingleImage } from '../middleware/upload.js';
import modelMotos from '../models/modelMotos.js';
import fs from 'fs';
import path from 'path';

const controllerMotos = {
    createMoto: async (sol, res) => {
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
                    message: 'Moto created',
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
                    message: 'Moto not found',
                    data: null,
                });
            }

            if (motoFound._id) {
                return res.json({
                    result: 'fine',
                    message: 'Moto read',
                    data: motoFound,
                });
            }
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred reading the moto by Id',
                data: error,
            });
        }
    },

    readMotos: async (sol, res) => {
        try {
            const allMotosFound = await modelMotos.find();
            res.json({
                result: 'fine',
                message: 'Motos read',
                data: allMotosFound,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred reading the motos',
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
                    message: 'moto not found',
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
                message: 'moto updated successfully',
                data: motoActualizada,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred updating the moto',
                data: error.message || error,
            });
        }
    },

}

export default controllerMotos;