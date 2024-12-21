const Product = require('../models/produit'); // Modèle Mongoose
const fs = require('fs');
const path = require('path');

// Ajouter un produit
exports.addProduct = async (req, res) => {
  try {
    const { title, brand, description, originalPrice, discountedPrice, promotion } = req.body;

    // Vérification des champs obligatoires
    if (!req.file || !title || !brand || !description || !originalPrice) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
    }

    // Création d'un nouveau produit
    const product = new Product({
      image: `https://back-end-fehk.onrender.com/uploads/${req.file.filename}`, // Ajout du chemin de l'image
      title,
      brand,
      description,
      originalPrice,
      discountedPrice,
      promotion: promotion || false, // La promotion est facultative, donc on définit la valeur par défaut à false
    });

    // Sauvegarde du produit
    await product.save();
    res.status(201).json(product); // Envoie la réponse avec le produit créé
  } catch (err) {
    res.status(500).json({ error: err.message }); // Gestion des erreurs serveur
  }
};

// Récupérer tous les produits
// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Récupère tous les produits de la base de données
    res.json(products); // Retourne la liste des produits
  } catch (err) {
    res.status(500).json({ error: err.message }); // Gestion des erreurs serveur
  }
};

// Récupérer un produit par son nom
exports.getProductByName = async (req, res) => {
  try {
    const product = await Product.findOne({ title: req.params.title }); // Recherche un produit par son titre
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' }); // Si le produit n'existe pas, on retourne une erreur 404
    res.json(product); // Retourne le produit trouvé
  } catch (err) {
    res.status(500).json({ error: err.message }); // Gestion des erreurs serveur
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Recherche du produit par son ID
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' }); // Si le produit n'existe pas, on retourne une erreur 404

    // Si une nouvelle image est envoyée, on met à jour l'image du produit
    if (req.file) {
      product.image = `http://localhost:5000/uploads/${req.file.filename}`; // On met à jour l'image
    }

    // Mise à jour des autres champs avec les données envoyées dans le corps de la requête
    Object.assign(product, req.body); // On met à jour les autres propriétés du produit

    // Sauvegarde du produit mis à jour
    await product.save();
    res.json(product); // Retourne le produit mis à jour
  } catch (err) {
    res.status(500).json({ error: err.message }); // Gestion des erreurs serveur
  }
};

// Supprimer un produit
// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Recherche du produit par son ID
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' }); // Si le produit n'existe pas, on retourne une erreur 404

    // Vérifier si l'image existe et la supprimer du dossier 'uploads'
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(product.image)); // Récupère le chemin complet de l'image
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Supprimer le fichier image
        console.log(`Image ${imagePath} supprimée`);
      } else {
        console.log(`Image ${imagePath} non trouvée`);
      }
    }

    // Utiliser deleteOne au lieu de remove
    await Product.deleteOne({ _id: req.params.id }); // Supprimer le produit avec l'ID correspondant
    res.json({ message: 'Produit supprimé avec succès' }); // Retourne un message de succès
  } catch (err) {
    console.error('Erreur lors de la suppression du produit:', err);
    res.status(500).json({ error: err.message }); // Gestion des erreurs serveur
  }
};
