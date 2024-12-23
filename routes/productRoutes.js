// Importation et configuration de multer pour gérer les fichiers (images)
const multer = require('multer');
const storage = multer.memoryStorage(); // Stocker les fichiers en mémoire pour les envoyer à Cloudinary
const upload = multer({ storage });
module.exports = upload;

// Routes pour les produits
const express = require('express');
const router = express.Router();
const productController = require('../controller/produitController');

// Déclaration des routes pour la gestion des produits
router.post('/addProduct', upload.single('image'), productController.addProduct); // Ajouter un produit
router.get('/getAllProducts', productController.getAllProducts); // Récupérer tous les produits
router.get('/getProductByName/:title', productController.getProductByName); // Récupérer un produit par son titre
router.put('/updateProduct/:id', upload.single('image'), productController.updateProduct); // Mettre à jour un produit
router.delete('/deleteProduct/:id', productController.deleteProduct); // Supprimer un produit

module.exports = router;