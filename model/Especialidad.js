const mongoose = require('mongoose');

let Schema = mongoose.Schema;
const especialidadSchema = new Schema({
        clave: {type: Number, unique:true},
        nombre: String
    },
    {
        versionKey: false
    });

const Especialidad = mongoose.model('especialidades', especialidadSchema);
module.exports = Especialidad;
