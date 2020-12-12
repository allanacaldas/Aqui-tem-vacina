const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boroughs = [
    "Aguas Compridas", "Aguazinha", "Alto da Bondade", "Alto da Conquista", "Alto da Nacao", "Alto do Sol Nascente",
    "Alto Nova Olinda", "Amaro Branco", "Amparo", "Bairro Novo", "Bonsucesso", "Bultrins", "Casa Caiada", "Caixa d'Agua",
    "Carmo", "Corrego do Abacaxi", "Fragoso", "Guadalupe", "Jardim Atlantico", "Jardim Fragoso", "Jardim Brasil", "Jatoba",
    "Milagres", "Monte", "Ouro Preto", "Passarinho", "Peixinhos", "Rio Doce", "Santa Tereza", "Salgadinho", "Sao Benedito",
    "Sapucaia", "Sitio Novo", "Tabajara", "Umuarama", "Varadouro", "Vila Popular", "Zona Rural"
]

const addressSchema = new Schema({
    street: String,
    zipcode: { type: String, unique: true },
    _id: false
})


const healthClinicSchema = new Schema({
    type: { type: String, required: [true, 'O preenchimento desse campo é obrigatório'], enum: ['Posto Volante', 'Drive Thru', 'Unidade Basica de Saude', 'UBS', "Unidade de Saude da Familia", "USF"] },
    address: { type: addressSchema, unique: true, required: [true, 'O preenchimento desse campo é obrigatório'] },
    borough: { type: String, required: [true, 'O preenchimento desse campo é obrigatório'], enum: boroughs },
    openingHours: { type: String, required: [true, 'O preenchimento desse campo é obrigatório'], default: "Segunda a Sexta - 8h às 17h" },
    vaccines: [{ type: Schema.Types.ObjectId, ref: 'Vaccine', required: true }]
}, { timestamps: true })


const healthClinic = mongoose.model('healthClinic', healthClinicSchema);

module.exports = healthClinic



