const express = require('express');
const router = express.Router();
const UserController = require('../controller/usersController');

// Route pour récupérer tous les utilisateurs (clients)
router.get('/getAllClients', UserController.getAllUsers);

// Route pour ajouter un nouveau client
router.post('/addClient', UserController.addClient);

// Route pour supprimer un client
router.delete('/deleteClient/:id', UserController.deleteClient);

module.exports = router;
