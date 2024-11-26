const express = require("express");
const router = express.Router();
const {
  getPharmaciesBySurvey,
  purchaseMedication,
} = require("../../controllers/pharmacyController"); // Sesuaikan dengan path ke controller

// Rute untuk mendapatkan apotek berdasarkan hasil survei
router.get("/surveys/:surveyId/pharmacies", getPharmaciesBySurvey);

// Rute untuk membeli obat
router.post("/purchase", purchaseMedication);

module.exports = router;
