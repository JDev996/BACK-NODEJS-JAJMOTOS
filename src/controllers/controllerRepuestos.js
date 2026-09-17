import { uploadSingleImage } from '../middleware/upload.js';
import modelRepuestos from '../models/modelRepuestos.js';
import fs from 'fs';
import path from 'path';

const controllerRepuestos = {
    createRepuesto: async (req, res) => {
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

                const newRepuesto = new modelRepuestos({
                    marca: req.body.marca,
                    referencia: req.body.referencia,
                    precio: req.body.precio,
                    stock: req.body.stock,
                    foto: req.file.filename
                });

                const savedRepuesto = await newRepuesto.save();

                res.json({
                    result: 'fine',
                    message: 'Repuesto creado',
                    data: savedRepuesto,
                });
            });
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred creating the repuesto',
                data: error,
            });
        }
    },

    readRepuestoId: async (req, res) => {
        try {
            const repuestoFound = await modelRepuestos.findById(req.params.id);

            if (!repuestoFound) {
                return res.json({
                    result: 'mistake',
                    message: 'Repuesto no encontrado',
                    data: null,
                });
            }

            return res.json({
                result: 'fine',
                message: 'Repuesto consultado',
                data: repuestoFound,
            });
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al consultar el repuesto por su identificador',
                data: error,
            });
        }
    },

    readRepuestos: async (req, res) => {
        try {
            const allRepuestosFound = await modelRepuestos.find();
            res.json({
                result: 'fine',
                message: 'Repuestos consultados',
                data: allRepuestosFound,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al consultar los repuestos',
                data: error,
            });
        }
    },

    updateRepuesto: async (req, res) => {
        try {
            const { id } = req.params;

            const repuestoExistente = await modelRepuestos.findById(id);

            if (!repuestoExistente) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }

                return res.json({
                    result: 'mistake',
                    message: 'Repuesto no encontrado',
                    data: null,
                });
            }

            if (req.file && repuestoExistente.Foto) {
                const rutaImagenAntigua = path.join('imagenes', repuestoExistente.Foto);

                if (fs.existsSync(rutaImagenAntigua)) {
                    fs.unlinkSync(rutaImagenAntigua);
                }
            }

            const nuevosDatos = {
                marca: req.body.marca,
                referencia: req.body.referencia,
                precio: req.body.precio,
                stock: req.body.stock,
                imagen: req.file ? req.file.filename : repuestoExistente.Foto,
            };

            const repuestoActualizado = await modelRepuestos.findByIdAndUpdate(
                id,
                nuevosDatos,
                { new: true, runValidators: true }
            );

            return res.json({
                result: 'fine',
                message: 'Repuesto actualizado correctamente',
                data: repuestoActualizado,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al actualizar el repuesto',
                data: error.message || error,
            });
        }
    },

    deleteRepuesto: async (req, res) => {
        try {
            const repuestoToDelete = await modelRepuestos.findByIdAndDelete(
                req.params.id
            );

            if (!repuestoToDelete) {
                return res.json({
                    result: 'mistake',
                    message: 'Repuesto no encontrado para eliminar',
                    data: null,
                });
            }

            if (repuestoToDelete.Foto) {
                const rutaImagen = path.join('imagenes', repuestoToDelete.Foto);

                if (fs.existsSync(rutaImagen)) {
                    fs.unlinkSync(rutaImagen);
                }
            }

            return res.json({
                result: 'fine',
                message: 'Repuesto eliminado correctamente',
                data: null,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al eliminar el repuesto',
                data: error.message || error,
            });
        }
    },

}

export default controllerRepuestos;