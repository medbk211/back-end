require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const usersRoutes = require('./routes/usersRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch((error) => console.error('Erreur de connexion à MongoDB:', error));

// Create the 'uploads' directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Routes
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API de mon projet !');
});

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/order', orderRoutes);
app.use('/uploads', express.static(uploadDir));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Une erreur s\'est produite sur le serveur.',
    error: err.message,
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
