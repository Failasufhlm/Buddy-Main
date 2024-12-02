const admin = require("firebase-admin");
const db = admin.firestore();
const geolib = require("geolib");

// Get all psychologists
const getAllPsychologists = async (req, res) => {
  try {
    const psychologistsSnapshot = await db.collection("psychologists").get();
    const psychologists = [];
    psychologistsSnapshot.forEach((doc) => {
      psychologists.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json({ psychologists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dapatkan psikolog terdekat
const getNearbyPsychologists = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10000, specialization, availability } = req.body;

    const psychologistsSnapshot = await db.collection("psychologists").get();
    const nearbyPsychologists = [];

    psychologistsSnapshot.forEach((doc) => {
      const psychologist = doc.data();
      
      // Calculate distance
      const distance = geolib.getDistance(
        { latitude, longitude },
        {
          latitude: psychologist.location.latitude,
          longitude: psychologist.location.longitude,
        }
      );

      // Filter by distance and additional criteria
      if (distance <= radius && 
          (!specialization || psychologist.specialization === specialization) &&
          (!availability || psychologist.availability === availability)) {
        
        nearbyPsychologists.push({
          id: doc.id,
          ...psychologist,
          distance,
          distanceKm: (distance / 1000).toFixed(1),
          estimatedTime: calculateEstimatedTime(distance)
        });
      }
    });

    // Sort by distance
    nearbyPsychologists.sort((a, b) => a.distance - b.distance);

    res.status(200).json({ 
      psychologists: nearbyPsychologists,
      total: nearbyPsychologists.length,
      searchRadius: `${radius/1000}km`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get psychologist by ID
const getPsychologistById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("psychologists").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Psychologist not found" });
    }

    res.status(200).json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new psychologist
const addPsychologist = async (req, res) => {
  try {
    const {
      name,
      specialization,
      experience,
      location,
      contact,
      availability,
    } = req.body;

    const docRef = await db.collection("psychologists").add({
      name,
      specialization,
      experience,
      location,
      contact,
      availability,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      id: docRef.id,
      message: "Psychologist added successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update psychologist
const updatePsychologist = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    await db
      .collection("psychologists")
      .doc(id)
      .update({
        ...updateData,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.status(200).json({ message: "Psychologist updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete psychologist
const deletePsychologist = async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("psychologists").doc(id).delete();
    res.status(200).json({ message: "Psychologist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPsychologists,
  getNearbyPsychologists,
  getPsychologistById,
  addPsychologist,
  updatePsychologist,
  deletePsychologist,
};