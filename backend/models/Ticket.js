const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user: { type: String, required: true }, // Assuming user is identified by username
    purchaseDate: { type: Date, default: Date.now },
    qrCode: {type:String}
});

module.exports = mongoose.model('Ticket', ticketSchema);