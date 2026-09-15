import { uploadImage } from '../middleware/upload.js';
import modelUsuario from '../models/modelUsuario.js';
import fs from 'fs';
import path from 'path';

const contUsuario = {

    createUsuario: async (req, res) => {
        try {
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
                const newUsuario = new modelUsuario({
                    nombre: req.body.nombre ?? req.body.Nombre,
                    apellido: req.body.apellido ?? req.body.Apellido,
                    correo: req.body.correo ?? req.body.Correo,
                    edad: req.body.edad ?? req.body.Edad,
                    rol: req.body.rol ?? req.body.Rol,
                    contraseña: req.body.contraseña ?? req.body.Contraseña,
                    foto: req.file.filename
                });
                const saveUsuario = await newUsuario.save();

                res.json({
                    mensaje: 'Usuario creado satisfactoriamente',
                    datos: saveUsuario
                });
            });
        } catch (error) {
            res.json({
                mensaje: 'Ocurrio un error creando el Usuario',
                datos: error
            });
        }
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
            if (usuarioFound._id) {
                return res.json({
                    mensaje: 'Usuario encontrado satisfactoriamente',
                    datos: usuarioFound,
                });
            }
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
            const fotoUpdate = await modelUsuario.findById(
                req.params.id
            );
            if (!fotoUpdate) {
                if (req.file) {
                    fs.unlinkSync(req.file.path);
                }
                return res.json({
                    mensaje: 'Usuario no encontrado',
                    datos: null,
                });
            }
            if (req.file) {
                if (fotoUpdate.foto) {
                    const actualizarImagen = path.join('imagenes', fotoUpdate.foto);
                    if (fs.existsSync(actualizarImagen)) {
                        fs.unlinkSync(actualizarImagen);
                    }
                }
            }
            const nuevoModeloUsuario = {
                nombre: req.body.nombre ?? req.body.Nombre,
                apellido: req.body.apellido ?? req.body.Apellido,
                correo: req.body.correo ?? req.body.Correo,
                edad: req.body.edad ?? req.body.Edad,
                rol: req.body.rol ?? req.body.Rol,
                contraseña: req.body.contraseña ?? req.body.Contraseña,
                foto: req.file ? req.file.filename : fotoUpdate.foto,
            };

            const usuarioUpdate = await modelUsuario.findByIdAndUpdate(
                req.params.id, nuevoModeloUsuario, {
                new: true
            });
            return res.json({
                mensaje: 'Usuario actualizado',
                datos: usuarioUpdate,
            });

        } catch (error) {
            res.json({
                mensaje: 'Error al actualizar el usuario',
                datos: error,
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

            res.json({
                mensaje: "Usuario eliminado correctamente.",
                datos: null,
            });

        } catch (error) {
            res.json({
                mensaje: "Error al eliminar el usuario.",
                datos: error,
            });
        }
    }

}
export default contUsuario;