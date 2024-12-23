const Loyalty = require("../models/Loyalty");

// Ajouter des points
exports.earnPoints = async (req, res) => {
  const { userId, points } = req.body;

  try {
    let loyalty = await Loyalty.findOne({ userId });

    if (!loyalty) {
      loyalty = new Loyalty({ userId });
    }

    loyalty.points += points;
    loyalty.history.push({ type: "earn", points });

    await loyalty.save();

    res.status(200).json({ message: "Points added successfully", loyalty });
  } catch (err) {
    res.status(500).json({ error: "Failed to add points" });
  }
};

// Réclamer des points
exports.redeemPoints = async (req, res) => {
  const { userId, points } = req.body;

  try {
    const loyalty = await Loyalty.findOne({ userId });

    if (!loyalty || loyalty.points < points) {
      return res.status(400).json({ error: "Not enough points" });
    }

    loyalty.points -= points;
    loyalty.history.push({ type: "redeem", points });

    await loyalty.save();

    res.status(200).json({ message: "Points redeemed successfully", loyalty });
  } catch (err) {
    res.status(500).json({ error: "Failed to redeem points" });
  }
};

// Obtenir les points d'un utilisateur
// Obtenir les points d'un utilisateur
exports.getLoyaltyPoints = async (req, res) => {
  const { userId } = req.params; // Ici, on récupère l'ID de l'utilisateur depuis l'URL

  try {
    const loyalty = await Loyalty.findOne({ userId });

    if (!loyalty) {
      return res.status(404).json({ error: "No loyalty points found" });
    }

    res.status(200).json({ loyalty });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve points" });
  }
};

