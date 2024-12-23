const multer = require('multer');
const storage = multer.memoryStorage(); // Stocker les fichiers en mémoire pour les envoyer à Cloudinary
const upload = multer({ storage });

module.exports = upload;
