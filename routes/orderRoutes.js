const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateStatus } = require('../controller/orderController');

// POST route to create a new order
router.post('/addOrder', createOrder);

// GET route to get all orders
router.get('/all', getAllOrders);

// PUT route to update order status
router.put('/:id/status', updateStatus);

module.exports = router;
