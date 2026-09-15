import { uploadSingleImage } from '../middleware/upload.js';
import modelRepuestos from '../models/modelRepuestos.js';
import fs from 'fs';
import path from 'path';

const controllerRepuestos = {
    createRepuesto: async (sol, res) => {
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

                const newRepuesto = new modelRepuestos({
                    marca: sol.body.marca,
                    referencia: sol.body.referencia,
                    precio: sol.body.precio,
                    stock: sol.body.stock,
                    imagen: sol.file.filename
                });

                const savedRepuesto = await newRepuesto.save();

                res.json({
                    result: 'fine',
                    message: 'Repuesto created',
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

    readRepuestoId: async (sol, res) => {
        try {
            const repuestoFound = await modelRepuestos.findById(sol.params.id);

            if (!repuestoFound) {
                return res.status(404).json({
                    result: 'mistake',
                    message: 'Repuesto not found',
                    data: null,
                });
            }

            if (repuestoFound._id) {
                return res.json({
                    result: 'fine',
                    message: 'Repuesto read',
                    data: repuestoFound,
                });
            }
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred reading the repuesto by Id',
                data: error,
            });
        }
    },

    readRepuestos: async (sol, res) => {
        try {
            const allRepuestosFound = await modelRepuestos.find();
            res.json({
                result: 'fine',
                message: 'Repuestos read',
                data: allRepuestosFound,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred reading the repuestos',
                data: error,
            });
        }
    },

    updateRepuesto: async (sol, res) => {
        try {
            const { id } = sol.params;

            const repuestoExistente = await modelRepuestos.findById(id);

            if (!repuestoExistente) {
                if (sol.file) {
                    fs.unlinkSync(sol.file.path);
                }

                return res.status(404).json({
                    result: 'mistake',
                    message: 'repuesto not found',
                    data: null,
                });
            }

            if (sol.file) {
                if (repuestoExistente.imagen) {
                    const rutaImagenAntigua = path.join('imagenes', repuestoExistente.imagen);

                    if (fs.existsSync(rutaImagenAntigua)) {
                        fs.unlinkSync(rutaImagenAntigua);
                    }
                }
            }

            const nuevosDatos = {
                marca: sol.body.marca,
                referencia: sol.body.referencia,
                precio: sol.body.precio,
                stock: sol.body.stock,
                imagen: sol.file ? sol.file.filename : repuestoExistente.imagen,
            };

            const repuestoActualizado = await modelRepuestos.findByIdAndUpdate(
                id,
                nuevosDatos,
                { new: true }
            );

            return res.json({
                result: 'fine',
                message: 'repuesto updated successfully',
                data: repuestoActualizado,
            });

        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'An error occurred updating the repuesto',
                data: error.message || error,
            });
        }
    },

}

export default controllerRepuestos;