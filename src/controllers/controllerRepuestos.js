import { uploadSingleImage } from '../middleware/upload.js';
import modelRepuestos from '../models/modelRepuestos.js';
import fs from 'fs';
import path from 'path';

const controllerRepuestos = {
    createRepuesto: async (sol, res) => {
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

    readRepuestoId: async (sol, res) => {
        try {
            const repuestoFound = await modelRepuestos.findById(sol.params.id);

            if (!repuestoFound) {
                return res.status(404).json({
                    result: 'mistake',
                    message: 'Repuesto no encontrado',
                    data: null,
                });
            }

            if (repuestoFound._id) {
                return res.json({
                    result: 'fine',
                    message: 'Repuesto consultado',
                    data: repuestoFound,
                });
            }
        } catch (error) {
            res.json({
                result: 'mistake',
                message: 'Ocurrio un error al consultar el repuesto por su identificador',
                data: error,
            });
        }
    },

    readRepuestos: async (sol, res) => {
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
                    message: 'Repuesto no encontrado',
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

}

export default controllerRepuestos;