import { Schema, model} from 'mongoose';

/**@type {*} */
const esquemaUsuario = new Schema({
    nombre:{
    type: String,
    required: true,
    trim: true
    
    },

    apellido:{
    type: String,
    required: true,
    trim: true
    
    },
    correo:{
    type: String,
    required: true,
    unique: true
    
    
    },
    edad:{
    type: Number,
    required: true,
    
    
    },
    rol:{
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
    
    },
    contraseña:{
    type: String,
    required: true,
    match: [/^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[$@$!%?&])[A-Za-z\d$@$!%?&]{8,15}/, 'password invalido']
    },
    foto:{
    type: String,
    required: true,
    trim: true
    }

},  

    {timestamps: true}

);

export default model ('Usuario', esquemaUsuario);

