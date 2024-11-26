const admin = require("firebase-admin");
const db = admin.firestore();

// Mendapatkan semua obat
const getAllMedications = async (req, res) => {
  try {
    const medicationsSnapshot = await db.collection("medications").get();
    const medications = [];
    medicationsSnapshot.forEach((doc) => {
      medications.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json({ medications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Menambahkan obat baru
const addMedication = async (req, res) => {
  try {
    const { name, description, dosage, sideEffects } = req.body;

    const docRef = await db.collection("medications").add({
      name,
      description,
      dosage,
      sideEffects,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      id: docRef.id,
      message: "Obat berhasil ditambahkan",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update obat
const updateMedication = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await db
      .collection("medications")
      .doc(id)
      .update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.status(200).json({ message: "Obat berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hapus obat
const deleteMedication = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("medications").doc(id).delete();
    res.status(200).json({ message: "Obat berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMedications,
  addMedication,
  updateMedication,
  deleteMedication,
};
