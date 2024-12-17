const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  personalInfo: {
    title: String,
    firstName: String,
    lastName: String,
    email: String,
  },
  addresses: {
    shippingAddress: String,
    city: String,
    postalCode: String,
    country: String,
    phoneNumber: String,
  },
  items: [
    {
      id: String,
      title: String,
      quantity: Number,
      discountedPrice: Number,
    },
  ],
  totalAmount: Number,
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['En cours', 'Livrée', 'Annulée'],
    default: 'En cours', // Default status
  },
});

module.exports = mongoose.model('Order', OrderSchema);
