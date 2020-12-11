const healthClinic = require('../models/HealthClinic.js');
const mongoose = require('mongoose');

const getAll = async (request, response) => {

    healthClinic.find()
        .then((list) => { response.status(200).json(list) })
        .catch(err => { response.status(500).json({ message: err }) })
}

const getByBorough = async (request, response) => {
    const { borough } = request.query;
    healthClinic.find({ borough: borough })
        .then((list) => {
            if (!list.length > 0) { return response.status(200).json({ message: `Não foi encontrada nenhuma Unidade de Saúde no bairro selecionado` }) }
            response.status(200).json(list)
        })
        .catch(err => { response.status(500).json(err) })

}

const getByVaccine = async (request, response) => {
    const { vaccine } = request.query;
    healthClinic.find()
        .then((list) => { response.status(200).json(list) })
        .catch(err => { response.status(500).json(err) })

}

const getByVaccineDose = async (request, response) => {
    const { dose } = request.query;
    const { vaccine } = request.query;

    healthClinic.find().populate({ path: 'vaccines', select: 'vaccine dose preventableDiseases', match: { $and: [{ vaccine: vaccine }, { dose: dose }] } })
        .then((list) => { response.status(200).json(list) })
        .catch(err => { response.status(500).json(err) })
}

const registerHealthClinic = async (request, response) => {
    const { type, address, borough, openingHours, vaccines } = request.body;

    healthClinic.create({
        type: type,
        address: address,
        borough: borough,
        openingHours: openingHours,
        vaccines: vaccines,
    })
        .then((newRegister) => { response.status(200).json({ message: `Nova unidade de Saúde registrada com sucesso`, newRegister }) })
        .catch(err => { response.status(500).json({ message: `Infelizmente, o registro de uma nova unidade de Saúde não pode ser efetuada.`, err }) })

}

const deleteHealthClinic = (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) { return response.status(400).json({ message: 'O ID inserido é inválido' }) }

    healthClinic.findByIdAndDelete(id)
        .then((list) => { response.status(200).json({ message: `A unidade de saúde selecionada (id:${id}) foi excluída da base de dados com sucesso` }) })
        .catch(err => { response.status(500).json(err) })
}

module.exports = {
    getAll,
    getByBorough,
    getByVaccine,
    getByVaccineDose,
    registerHealthClinic,
    deleteHealthClinic
    
}