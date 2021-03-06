const healthClinic = require('../models/HealthClinic')
const mongoose = require('mongoose');
const healthClinicSchema = require('../validators/healthClinics');
const { validatingBorough, boroughs } = require('../helpers/healthClinic');


const getAll = async (request, response) => {

    healthClinic.find().populate({ path: 'vaccines', select: 'vaccine dose preventableDiseases' })
        .then((list) => { response.status(200).json(list) })
        .catch(err => { response.status(500).json({ message: err }) })
}

const getByBorough = async (request, response) => {
    const { borough } = request.query;
    healthClinic.find({ borough: borough }).populate({ path: 'vaccines', select: 'vaccine dose preventableDiseases' })
        .then((list) => {
            if (!list.length > 0) { return response.status(200).json({ message: `Não foi encontrada nenhuma Unidade de Saúde no bairro selecionado` }) }
            response.status(200).json(list)
        })
        .catch(err => { response.status(500).json(err) })

}

const getByVaccine = async (request, response) => {
    const { vaccine } = request.query;
    healthClinic.find().populate({ path: 'vaccines', select: 'vaccine dose preventableDiseases', match: { vaccine: vaccine } })
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

    try {
        const validatedRegister = await healthClinicSchema.validate(request.body)
        if (!(await validatingBorough(request.body.borough))) { return response.status(401).json({message:`Insira uma bairro válido. Em caso de dúvida, confira a lista abaixo`, boroughs}) }

        healthClinic.create({
            type: validatedRegister.type,
            address: validatedRegister.address,
            borough: validatedRegister.borough,
            openingHours: validatedRegister.openingHours,
            vaccines: validatedRegister.vaccines,
        })
            .then((newRegister) => { response.status(200).json({ message: `Nova unidade de Saúde registrada com sucesso`, newRegister }) })
            .catch(err => { response.status(500).json({ message: `Infelizmente, o registro de uma nova unidade de Saúde não pode ser efetuada.`, err }) })
    }

    catch (err) { console.log(err); return response.status(500) }
}

const updateHealthClinic = async (request, response) => {
    const { id } = request.params;
    const validatedRegister = await healthClinicSchema.validate(request.body)

    if (!mongoose.Types.ObjectId.isValid(id)) { return response.status(400).json({ message: 'O ID inserido é inválido' }) }
    if (!(await validatingBorough(request.body.borough))) { return response.status(401).json({message:`Insira uma bairro válido. Em caso de dúvida, confira a lista abaixo`, boroughs}) }

    healthClinic.findByIdAndUpdate(id, validatedRegister)
        .then(() => { response.status(200).json({ message: `A unidade de Saúde selecionada ${request.params.id} foi atualizada com sucesso` }) })
        .catch((err) => response.status(500).json(err))

}

const updateAddress = async (request, response) => {
    const { id } = request.params;
    const { address } = request.body;

    if (!mongoose.Types.ObjectId.isValid(id)) { return response.status(400).json({ message: 'O ID inserido é inválido' }) }

    healthClinic.findByIdAndUpdate(id, { $set: { address: address } })
        .then(() => { response.status(200).json({ message: `O endereço da unidade de Saúde selecionada ${request.params.id} foi atualizado com sucesso` }) })
        .catch((err) => response.status(500).json({ message: `Não foi possível atualizar o cadastro da unidade de Saúde`, err }))
}

const updateVaccinesList = async (request, response) => {
    const { id } = request.params;
    const { vaccines } = request.body;
    let filteredList = [];

    vaccines.forEach(vaccine => { if (!filteredList.includes(vaccine._id)) { filteredList.push(vaccine._id) } });

    healthClinic.findByIdAndUpdate(id, { $set: { vaccines: filteredList } })
        .then(() => { response.status(200).json({ message: `A lista de vacinas da unidade de Saúde selecionada ${request.params.id} foi atualizada com sucesso` }) })
        .catch((err) => response.status(500).json(err))
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
    updateHealthClinic,
    updateAddress,
    updateVaccinesList,
    deleteHealthClinic

}