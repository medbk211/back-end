const Order = require('../models/order');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { personalInfo, addresses, items, totalAmount } = req.body;

    // Validate that all necessary fields are provided
    if (!personalInfo || !addresses || !items || totalAmount === undefined) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs nécessaires." });
    }

    // Save order to the database
    const newOrder = new Order({
      personalInfo,
      addresses,
      items,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    // Return success response
    res.status(201).json({
      message: "Commande créée avec succès",
      order: savedOrder,
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Une erreur s'est produite lors de la soumission de la commande." });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error });
  }
};

// Update order status
const updateStatus = async (req, res) => {
  const orderId = req.params.id; // Get order ID from URL parameter
  const { newStatus } = req.body; // Get new status from the request body

  // Validate the new status
  if (!['En cours', 'Livrée', 'Annulée'].includes(newStatus)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }

  try {
    // Find the order by ID and update the status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true } // Return the updated order
    );

    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }

    // Return the updated order
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
};

module.exports = { createOrder, getAllOrders, updateStatus };
