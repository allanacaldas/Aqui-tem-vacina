const yup = require('yup');

const healthClinicSchema = yup.object().shape({
    address: yup.object({
        street: yup.string().required('Campo Obrigatório'),
        zipcode: yup.string().min(8).required('Campo obrigatório')
    }
    ).required('Campo Obrigatório')
}, { timestamps: true })

module.exports = healthClinicSchema