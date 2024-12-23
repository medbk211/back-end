const express = require("express");
const {
    earnPoints,
    redeemPoints,
    getLoyaltyPoints,
} = require("../controller/loyaltyContoller");

const router = express.Router();

// Route pour ajouter des points
router.post("/earn", earnPoints);

// Route pour réclamer des points
router.post("/redeem", redeemPoints);

// Route pour obtenir les points d'un utilisateur
router.get("/:userId", getLoyaltyPoints);

module.exports = router;
