const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: String, required: true },
  discountedPrice: { type: String },
  promotion: { type: Boolean, default: false },
  image: { type: String, required: true }, // URL de l'image stockée
});

const Produit = mongoose.model('Produit', produitSchema);

module.exports = Produit;
