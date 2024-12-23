const Product = require('../models/produit'); // Modèle Mongoose pour les produits
const Joi = require('joi'); // Validation des données avec Joi
const cloudinary = require('../config/cloudinary');

// Validation du produit avec Joi
const productSchema = Joi.object({
  title: Joi.string().required(),
  brand: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  originalPrice: Joi.number().positive().required(),
  discountedPrice: Joi.number().positive().optional(),
  promotion: Joi.boolean().optional(),
});

// Ajouter un produit
exports.addProduct = async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Une image est obligatoire.' });
    }

    const { title, brand, description, category, originalPrice, discountedPrice, promotion } = req.body;

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
        if (error) reject(new Error('Erreur lors du téléchargement de l\'image.'));
        else resolve(result);
      }).end(req.file.buffer);
    });

    const product = new Product({
      image: uploadResult.secure_url,
      title,
      brand,
      description,
      category,
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

    if (product.image) {
      try {
        const publicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (err) {
        console.warn(`Impossible de supprimer l'image Cloudinary : ${err.message}`);
      }
    }

    await product.deleteOne();
    res.json({ message: 'Produit supprimé avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
};
