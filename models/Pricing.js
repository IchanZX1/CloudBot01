const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    durationDays: { type: Number, required: true },
    features: [{ type: String }],
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Pricing', PricingSchema);
