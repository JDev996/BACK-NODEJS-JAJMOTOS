import { uploadSingleImage } from '../middleware/upload.js';
import modelMotos from '../models/modelMotos.js';
import fs from 'fs';
import path from 'path';

const controllerMotos = {
    createMoto: async (req, res) => {
        try {
            uploadSingleImage(req, res, async (error) => {
                if (error) {
                    return res.json({
                        result: 'mistake',
                        message: 'Ocurrio un error al cargar la imagen',
                        data: error,
                    });
                }

                if (!req.file) {
                    return res.json({
                        result: 'mistake',
                        message: 'La imagen es obligatoria',
                        data: null,
                    });
                }

                const newMoto = new modelMotos({
                    modelo: req.body.modelo,
                    marca: req.body.marca,
                    referencia: req.body.referencia,
                    cilindraje: req.body.cilindraje,
                    precio: req.body.precio,
                    stock: req.body.stock,
                    imagen: req.file.filename
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

    readMotoId: async (req, res) => {
        try {
            const motoFound = await modelMotos.findById(req.params.id);

            if (!motoFound) {
                return res.json({
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

    readMotos: async (req, res) => {
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

    updateMoto: async (req, res) => {
        try {
            const { id } = req.params;

            const motoExistente = await modelMotos.findById(id);

            if (!motoExistente) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }

                return res.json({
                    result: 'mistake',
                    message: 'Moto no encontrada',
                    data: null,
                });
            }

            if (req.file) {
                if (motoExistente.imagen) {
                    const rutaImagenAntigua = path.join('imagenes', motoExistente.imagen);

                    if (fs.existsSync(rutaImagenAntigua)) {
                        fs.unlinkSync(rutaImagenAntigua);
                    }
                }
            }

            const nuevosDatos = {
                modelo: req.body.modelo,
                marca: req.body.marca,
                referencia: req.body.referencia,
                cilindraje: req.body.cilindraje,
                precio: req.body.precio,
                stock: req.body.stock,
                imagen: req.file ? req.file.filename : motoExistente.imagen,
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

    deleteMoto: async (req, res) => {
        try {
            const motoToDelete = await modelMotos.findByIdAndDelete(
                req.params.id
            );

            if (!motoToDelete) {
                return res.json({
                    result: 'mistake',
                    message: 'Moto no encontrada para eliminar',
                    data: null,
                });
            }

            if (motoToDelete.imagen) {
                const rutaImagen = path.join('imagenes', motoToDelete.imagen);

                if (fs.existsSync(rutaImagen)) {
                    fs.unlinkSync(rutaImagen);
                }
            }

            return res.json({
                result: 'fine',
                message: 'Moto eliminada correctamente',
                data: null,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al eliminar la moto',
                data: error.message || error,
            });
        }
    },

}

export default controllerMotos;