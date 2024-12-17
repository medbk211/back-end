const express = require('express');
const router = express.Router();
const productController = require('../controller/produitController');
const multer = require('multer');
const path = require('path');

// Configuration Multer pour gérer les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Dossier où sauvegarder les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Renommer les fichiers
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const isValidType = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValidType) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'));
  }
};

const upload = multer({ storage, fileFilter });

// Routes pour les produits
router.post('/addProduct', upload.single('image'), productController.addProduct);
router.get('/getAllProducts', productController.getAllProducts);
router.get('/getProductByName/:title', productController.getProductByName);
router.put('/updateProduct/:id', upload.single('image'), productController.updateProduct);
router.delete('/deleteProduct/:id', productController.deleteProduct);

module.exports = router;
