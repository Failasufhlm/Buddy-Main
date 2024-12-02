const express = require("express");
const router = express.Router();

// Contoh data Toko Obat (Drugstores) dengan daftar obat yang tersedia
const drugstores = [
  {
    id: 1,
    name: "Toko Obat Sehat",
    address: "Jl. Sehat No. 1",
    phone: "082134752949",
    availableMedicines: ["Paracetamol", "Amoxicillin", "Vitamin C"],
  },
  {
    id: 2,
    name: "Apotek Keluarga",
    address: "Jl. Keluarga No. 2",
    phone: "082134752949",
    availableMedicines: ["Ibuprofen", "Cetrizine"],
  },
  // Tambahkan lebih banyak data sesuai kebutuhan
];

// Fungsi untuk mendapatkan semua Toko Obat
const getAllDrugstores = (req, res) => {
  res.json(drugstores);
};

// Fungsi untuk menemukan Toko Obat berdasarkan obat yang dibutuhkan
const getDrugstoresByMedicine = (req, res) => {
  const medicineName = req.params.name;

  // Validasi input: pastikan nama obat tidak kosong
  if (!medicineName || medicineName.trim() === "") {
    return res.status(400).send("Nama obat tidak boleh kosong.");
  }

  // Mencari Toko Obat yang memiliki obat yang dibutuhkan
  const availableDrugstores = drugstores.filter((drugstore) =>
    drugstore.availableMedicines
      .map((m) => m.toLowerCase())
      .includes(medicineName.toLowerCase())
  );

  // Jika tidak ada Toko Obat yang ditemukan
  if (availableDrugstores.length === 0) {
    return res
      .status(404)
      .send("Toko Obat tidak ditemukan untuk obat yang diminta.");
  }

  res.json(availableDrugstores);
};

// Ekspor fungsi-fungsi untuk digunakan dalam routes.js
module.exports = {
  getAllDrugstores,
  getDrugstoresByMedicine,
};
