import modelUsuario from "../models/modelUsuario.js";
import { generarToken, validarToken } from "../token/generate.js";

const loginController = {
    login: async (req, res) => {
        try {
            const { correo, password } = req.body;

            const usuarioFound = await modelUsuario.findOne({ correo });

            if (!usuarioFound) {
                return res.json({
                    mensaje: 'Credenciales inválidas',
                    datos: null,
                });
            }

            if (password !== usuarioFound.password) {
                return res.json({
                    mensaje: 'Credenciales inválidas',
                    datos: null,
                });
            }

            const token = await generarToken({
                id: usuarioFound._id,
                nombre: usuarioFound.nombre,
                correo: usuarioFound.correo,
                rol: usuarioFound.rol
            });

            return res.json({
                mensaje: `Bienvenid@ ${usuarioFound.nombre}`,
                rol: usuarioFound.rol,
                datos: token,
            });

        } catch (error) {
            return res.json({
                mensaje: 'Se presenta un error durante su ingreso',
                datos: error.message,
            });
        }
    },

    validarToken: async (req, res) => {
        try {
            const tokenA = req.params.token;
            const validate = await validarToken(tokenA);

            if (validate && validate.id) {
                return res.json({
                    mensaje: 'El token es válido',
                    datos: validate,
                });
            }

            return res.json({
                mensaje: 'Token no es válido',
                datos: null,
            });
        } catch (error) {
            return res.json({
                mensaje: 'Durante la validación del token se presentó un error',
                datos: error.message,
            });
        }
    }
}

export default loginController;