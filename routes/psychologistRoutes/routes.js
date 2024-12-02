const express = require("express");
const router = express.Router();
const drugstoreController = require("./controllers"); //

// Endpoint untuk mendapatkan semua Toko Obat
router.get("/", drugstoreController.getAllDrugstores);

// Endpoint untuk mencari Toko Obat berdasarkan obat yang dibutuhkan
router.get("/medicine/:name", drugstoreController.getDrugstoresByMedicine);

// Ekspor router untuk digunakan dalam aplikasi utama
module.exports = router;
