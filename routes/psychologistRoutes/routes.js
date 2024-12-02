const express = require('express');
const router = express.Router();
const { 
    getAllPsychologists,
    getNearbyPsychologists,
    getPsychologistById,
    addPsychologist,
    updatePsychologist,
    deletePsychologist
} = require('./controllers');

// Get all psychologists
router.get('/', getAllPsychologists);

// Get nearby psychologists based on user location
router.post('/nearby', getNearbyPsychologists);

// Get specific psychologist
router.get('/:id', getPsychologistById);

// Add new psychologist
router.post('/', addPsychologist);

// Update psychologist
router.put('/:id', updatePsychologist);

// Delete psychologist
router.delete('/:id', deletePsychologist);

module.exports = router;
