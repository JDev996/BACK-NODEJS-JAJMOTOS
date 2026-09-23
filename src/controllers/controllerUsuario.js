import { uploadImage } from '../middleware/upload.js';
import modelUsuario from '../models/modelUsuario.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const contUsuario = {

    createUsuario: async (req, res) => {
        uploadImage(req, res, async (error) => {
            if (error) {
                return res.json({
                    mensaje: 'Ocurrio un error cargando la imagen',
                    datos: error
                });
            }
            if (!req.file) {
                return res.json({
                    mensaje: 'La imagen es obligatoria',
                    datos: null
                });
            }

            try {
                const hashedPassword = await bcrypt.hash(req.body.password, 10);

                const newUsuario = new modelUsuario({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    correo: req.body.correo,
                    edad: req.body.edad,
                    rol: req.body.rol,
                    password: hashedPassword,
                    Foto: req.file.filename
                });

                const saveUsuario = await newUsuario.save();

                return res.json({
                    mensaje: `usuario ${saveUsuario.rol} creado satisfactoriamente`,
                    datos: saveUsuario
                });

            } catch (err) {
                return res.json({
                    mensaje: 'Ocurrio un error creando el Usuario',
                    datos: err.message
                });
            }
        });
    },

    readUsuario: async (req, res) => {
        try {
            const usuarioFound = await modelUsuario.findById(req.params.id);

            if (!usuarioFound) {
                return res.json({
                    mensaje: 'Usuario no encontrado',
                    datos: null,
                });
            }

            return res.json({
                mensaje: 'Usuario encontrado satisfactoriamente',
                datos: usuarioFound,
            });
        } catch (error) {
            res.json({
                mensaje: 'Ocurrio un error encontrando el Usuario',
                datos: error,
            });
        }
    },

    readUsuarios: async (req, res) => {
        try {
            const usuarios = await modelUsuario.find();
            return res.json({
                mensaje: 'Usuarios encontrados satisfactoriamente',
                datos: usuarios,
            });
        } catch (error) {
            return res.json({
                mensaje: 'Ocurrio un error encontrando los Usuarios',
                datos: error,
            });
        }
    },

    updateUsuario: async (req, res) => {
        try {
            const usuarioExistente = await modelUsuario.findById(req.params.id);

            if (!usuarioExistente) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.json({
                    mensaje: 'Usuario no encontrado',
                    datos: null,
                });
            }

            if (req.file && usuarioExistente.foto) {
                const actualizarImagen = path.join('imagenes', usuarioExistente.foto);
                if (fs.existsSync(actualizarImagen)) {
                    fs.unlinkSync(actualizarImagen);
                }
            }

            const nuevoModeloUsuario = {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                correo: req.body.correo,
                edad: req.body.edad,
                rol: req.body.rol,
                password: req.body.password,
                foto: req.file ? req.file.filename : usuarioExistente.foto,
            };

            const usuarioUpdate = await modelUsuario.findByIdAndUpdate(
                req.params.id,
                nuevoModeloUsuario,
                { new: true, runValidators: true }
            );

            return res.json({
                mensaje: 'Usuario actualizado',
                datos: usuarioUpdate,
            });

        } catch (error) {
            res.json({
                mensaje: 'Error al actualizar el usuario',
                datos: error.message || error,
            });
        }
    },

    deleteUsuario: async (req, res) => {
        try {
            const usuarioToDelete = await modelUsuario.findByIdAndDelete(
                req.params.id
            );

            if (!usuarioToDelete) {
                return res.json({
                    mensaje: "Usuario no encontrado para eliminar.",
                    datos: null,
                })
            }

            if (usuarioToDelete.foto) {
                const rutaFoto = path.join('imagenes', usuarioToDelete.foto);

                if (fs.existsSync(rutaFoto)) {
                    fs.unlinkSync(rutaFoto);
                }
            }

            return res.json({
                mensaje: "Usuario eliminado correctamente.",
                datos: null,
            });

        } catch (error) {
            res.json({
                mensaje: "Error al eliminar el usuario.",
                datos: error.message || error,
            });
        }
    }

}
export default contUsuario;