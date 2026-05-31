const mongoose = require('mongoose');

const DepositSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pricing', required: true },
    reffId: { type: String, required: true, unique: true },
    depositId: { type: String }, // From AtlanticH2H
    nominal: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'success', 'failed', 'cancelled', 'expired'], default: 'pending' },
    paymentMethod: { type: String, default: 'qris' },
    paymentData: { type: Object }, // Store API response (QR code etc)
}, { timestamps: true });

module.exports = mongoose.model('Deposit', DepositSchema);
