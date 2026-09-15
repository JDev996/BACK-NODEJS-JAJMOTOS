import { Schema, model } from 'mongoose';

const esquemaRepuesto = new Schema({
id: {
    type: String,
    required: false,
    trim: true,
    unique: true
},
marca: {
    type: String,
    required: true,
    trim: true
},
referencia: {
    type: String,
    required: true,
    trim: true
},
precio: {
    type: Number,
    required: true,
    min: 0
},
stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
},
imagen: {
    type: String,
    required: true,
    trim: true
}
}, {
timestamps: true
});

export default model('Repuesto', esquemaRepuesto);