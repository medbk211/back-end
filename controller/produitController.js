// Contrôleur pour les produits (CRUD)
const Product = require('../models/produit'); // Modèle Mongoose pour les produits
const fs = require('fs/promises'); // Version promesse de fs pour la suppression des fichiers
const path = require('path');
const Joi = require('joi'); // Validation des données avec Joi
const cloudinary = require('../config/cloudinary');

// Définir une URL de base pour les images
const BASE_IMAGE_URL = 'https://back-end-fehk.onrender.com/uploads/';

// Validation du produit avec Joi
const productSchema = Joi.object({
  title: Joi.string().required(),
  brand: Joi.string().required(),
  description: Joi.string().required(),
  originalPrice: Joi.number().positive().required(),
  discountedPrice: Joi.number().positive().optional(),
  promotion: Joi.boolean().optional(),
});

// Ajouter un produit
exports.addProduct = async (req, res) => {
  try {
    // Validation des données
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Vérification de la présence de l'image
    if (!req.file) {
      return res.status(400).json({ error: 'Une image est obligatoire.' });
    }

    const { title, brand, description, originalPrice, discountedPrice, promotion } = req.body;

    // Téléchargement de l'image sur Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
        if (error) reject(new Error('Erreur lors du téléchargement de l\'image.'));
        else resolve(result);
      }).end(req.file.buffer);
    });

    // Création du produit avec les données et l'image téléchargée
    const product = new Product({
      image: uploadResult.secure_url,
      title,
      brand,
      description,
      originalPrice,
      discountedPrice,
      promotion: promotion || false,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
};

// Récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
};

// Récupérer un produit par son titre
exports.getProductByName = async (req, res) => {
  try {
    const product = await Product.findOne({ title: req.params.title });
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
};

// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }

    // Mise à jour de l'image sur Cloudinary si une nouvelle image est fournie
    if (req.file) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
          if (error) reject(new Error('Erreur lors du téléchargement de l\'image.'));
          else resolve(result);
        }).end(req.file.buffer);
      });

      product.image = uploadResult.secure_url;
    }

    // Mise à jour des autres champs
    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
};

// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé.' });
    }

    // Suppression de l'image associée dans le système de fichiers
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(product.image));
      try {
        await fs.unlink(imagePath);
        console.log(`Image ${imagePath} supprimée`);
      } catch (err) {
        console.warn(`Impossible de supprimer l'image ${imagePath}: ${err.message}`);
      }
    }

    // Suppression du produit dans la base de données
    await product.deleteOne();
    res.json({ message: 'Produit supprimé avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
};