const express = require("express");
const router = express.Router();
const {
  getAllMedications,
  addMedication,
  updateMedication,
  deleteMedication,
} = require("./controllers");

// Mendapatkan semua obat
router.get("/", getAllMedications);

// Menambahkan obat baru
router.post("/", addMedication);

// Update obat
router.put("/:id", updateMedication);

// Hapus obat
router.delete("/:id", deleteMedication);

module.exports = router;
