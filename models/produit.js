const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'category',required: true },
  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number },
  promotion: { type: Boolean, default: false },
  image: { type: String, required: true }, // URL de l'image stockée
});

const Produit = mongoose.model('Produit', produitSchema);

module.exports = Produit;
