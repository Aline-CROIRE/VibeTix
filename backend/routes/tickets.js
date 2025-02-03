const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const QRCode = require('qrcode');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Get all tickets
 *     description: Retrieve a list of all tickets.
  *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: A list of tickets.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       500:
 *         description: Internal server error.
 */
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('event');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     description: Retrieve a specific ticket using its ID.
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ticket to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested ticket.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', getTicket, (req, res) => {
  res.json(res.ticket);
});

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Purchase a new ticket
 *     description: Purchase a new ticket with the given information.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketInput'
 *     responses:
 *       201:
 *         description: Ticket successfully purchased.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Not authorized, token failed.
 */
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, user } = req.body;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if tickets are available
    if (event.availableTickets <= 0) {
      return res.status(400).json({ message: 'No tickets available for this event' });
    }

    // Generate QR code data
    const qrCodeData = JSON.stringify({
      ticketId: new mongoose.Types.ObjectId(),
      event: eventId,
      user: user,
      purchaseDate: new Date(),
    });
    // Generate QR code
    const qrCode = await QRCode.toDataURL(qrCodeData);

    const ticket = new Ticket({
      event: eventId,
      user: user,
      qrCode: qrCode,
    });
    const newTicket = await ticket.save();

    // Decrement available tickets
    event.availableTickets -= 1;
    await event.save();

    res.status(201).json(newTicket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /tickets/{id}:
 *   delete:
 *     summary: Delete a ticket
 *     description: Delete a ticket with the given ID.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the ticket to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket successfully deleted.
 *       404:
 *         description: Ticket not found.
 *       401:
 *         description: Not authorized, token failed.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', protect, getTicket, async (req, res) => {
  try {
    await res.ticket.remove();
    res.json({ message: 'Deleted Ticket' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getTicket(req, res, next) {
  let ticket;
  try {
    ticket = await Ticket.findById(req.params.id).populate('event');
    if (ticket == null) {
      return res.status(404).json({ message: 'Cannot find ticket' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.ticket = ticket;
  next();
}

module.exports = router;