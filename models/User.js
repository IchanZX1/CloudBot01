const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    role: { type: String, default: 'user' },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function () {
            return this.authProvider !== 'google';
        },
        default: null
    },
    no_Wa: {
        type: String,
        required: function () {
            return this.authProvider !== 'google';
        },
        default: ''
    },
    no_Bot: { type: String, default: '' },
    paket: { type: String, default: 'free' },
    _expired: { type: Date, default: null },
    otp: { type: String, default: null },
    otp_expiry: { type: Date, default: null },
    last_otp_request: { type: Date, default: null },
    is_verified: { type: Boolean, default: false },
    verify_method: { type: String, default: 'email' },
    lastTrialClaim: { type: Date, default: null },
    profilePic: { type: String, default: '/img/default-profile.png' },
    currentSessionId: { type: String, default: null },
    registerIP: { type: String, default: null },
    googleId: { type: String, default: undefined },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' }
}, { timestamps: true });

UserSchema.index(
    { googleId: 1 },
    {
        unique: true,
        partialFilterExpression: { googleId: { $type: 'string' } }
    }
);

// Logic to check expiration and reset to free
UserSchema.methods.checkExpiration = function () {
    if (this.paket !== 'free' && this._expired && new Date() > this._expired) {
        this.paket = 'free';
        this._expired = null;
        return true;
    }
    return false;
};

module.exports = mongoose.model('User', UserSchema);
