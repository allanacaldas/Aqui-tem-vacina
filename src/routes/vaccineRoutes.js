const express = require('express');
const router = express.Router();
const vaccineController = require('../controllers/vaccineController.js')


router.get('/', vaccineController.getAll);

router.get('/batch', vaccineController.getByBatch);

router.get('/vaccine', vaccineController.getByVaccine);

router.post('/register', vaccineController.registerVaccine);

router.put('/update/:id', vaccineController.updateVaccine);

router.patch('/update-preventable-diseases/:id', vaccineController.insertPreventableDisease);

router.delete('/delete/:id', vaccineController.deleteVaccine);

module.exports = router;
