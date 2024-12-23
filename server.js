require('dotenv').config();

// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

// Importation des routes personnalisées
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const usersRoutes = require('./routes/usersRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Initialisation de l'application Express
const app = express();

// Middleware pour gérer les politiques CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Middleware pour analyser les requêtes JSON et URL-encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour le logging des requêtes HTTP
app.use(morgan('dev'));

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

// Création du répertoire 'uploads' s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Route de base pour tester l'API
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API de mon projet !');
});

// Ajout des routes pour les différentes fonctionnalités
app.use('/api/auth', authRoutes); // Routes pour l'authentification
app.use('/api/product', productRoutes); // Routes pour les produits
app.use('/api/users', usersRoutes); // Routes pour les utilisateurs
app.use('/api/order', orderRoutes); // Routes pour les commandes
app.use('/uploads', express.static(uploadDir)); // Accès aux fichiers statiques dans le dossier 'uploads'

// Middleware global pour la gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur s\'est produite sur le serveur.',
    error: err.message,
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`)
);