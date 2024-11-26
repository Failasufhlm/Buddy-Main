const admin = require("firebase-admin");
const db = admin.firestore();

// Dapatkan toko obat berdasarkan hasil survei
const getPharmaciesBySurvey = async (req, res) => {
  const { surveyId } = req.params;

  try {
    const surveyDoc = await db.collection("surveys").doc(surveyId).get();
    if (!surveyDoc.exists) {
      return res.status(404).json({ error: "Survey not found" });
    }

    const surveyData = surveyDoc.data();
    const medicationsNeeded = surveyData.medicationNeeded;

    const pharmaciesSnapshot = await db.collection("pharmacies").get();
    const availablePharmacies = [];

    pharmaciesSnapshot.forEach((doc) => {
      const pharmacy = doc.data();

      const hasMedications = medicationsNeeded.every((medication) =>
        pharmacy.medications.includes(medication)
      );

      if (hasMedications) {
        availablePharmacies.push({
          id: doc.id,
          ...pharmacy,
        });
      }
    });

    // Menambahkan informasi obat dan tautan e-commerce
    const medicationsInfo = await getMedicationsInfo(medicationsNeeded);

    res.status(200).json({
      pharmacies: availablePharmacies,
      medications: medicationsInfo,
      total: availablePharmacies.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fungsi untuk mendapatkan informasi obat
const getMedicationsInfo = async (medicationsNeeded) => {
  // Contoh data obat
  const medicationData = {
    medicationId1: {
      name: "Obat A",
      ecommerceLink: "https://ecommerce.com/obat-a",
    },
    medicationId2: {
      name: "Obat B",
      ecommerceLink: "https://ecommerce.com/obat-b",
    },
    medicationId3: {
      name: "Obat C",
      ecommerceLink: "https://ecommerce.com/obat-c",
    },
  };

  return medicationsNeeded.map((medicationId) => medicationData[medicationId]);
};

module.exports = {
  getPharmaciesBySurvey,
  purchaseMedication,
};
