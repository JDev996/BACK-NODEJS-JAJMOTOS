import { Schema, model } from 'mongoose';

const esquemaUsuario = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    edad: {
        type: Number,
        required: true
    },
    rol: {
        type: String,
        enum: ['admin', 'usuario'],
        default: 'usuario'
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                if (/^\$2[aby]\$/.test(v)) return true;
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%?&*])[A-Za-z\d$@$!%?&*]{8,15}$/.test(v);
            },
            message: 'La contraseña debe tener 8-15 caracteres, una mayúscula, una minúscula, un número y un carácter especial'
        }
    },
    Foto: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export default model('Usuario', esquemaUsuario);