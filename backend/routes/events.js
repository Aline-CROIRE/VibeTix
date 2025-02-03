const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     description: Retrieve a list of all available events.
  *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error.
 */
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get an event by ID
 *     description: Retrieve a specific event using its ID.
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested event.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Event not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', getEvent, (req, res) => {
  res.json(res.event);
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     description: Create a new event with the given information.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventInput'
 *     responses:
 *       201:
 *         description: Event successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Not authorized, token failed.
 */
router.post('/', protect, async (req, res) => {
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    venue: req.body.venue,
    totalTickets: req.body.totalTickets,
    availableTickets: req.body.totalTickets,
    price: req.body.price,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   patch:
 *     summary: Update an existing event
 *     description: Update an existing event with the given information.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: '#/components/schemas/EventInput'
 *     responses:
 *       200:
 *         description: Event successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Event not found.
 *       401:
 *         description: Not authorized, token failed.
 */
router.patch('/:id', protect, getEvent, async (req, res) => {
  if (req.body.title != null) {
    res.event.title = req.body.title;
  }
  if (req.body.description != null) {
    res.event.description = req.body.description;
  }
  if (req.body.date != null) {
    res.event.date = req.body.date;
  }
  if (req.body.venue != null) {
    res.event.venue = req.body.venue;
  }
  if (req.body.totalTickets != null) {
    res.event.totalTickets = req.body.totalTickets;
  }
  if (req.body.availableTickets != null) {
    res.event.availableTickets = req.body.availableTickets;
  }
  if (req.body.price != null) {
    res.event.price = req.body.price;
  }

  try {
    const updatedEvent = await res.event.save();
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     description: Delete an event with the given ID.
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event successfully deleted.
 *       404:
 *         description: Event not found.
 *       401:
 *         description: Not authorized, token failed.
 *       500:
 *         description: Internal server error.
 */
router.delete('/:id', protect, getEvent, async (req, res) => {
  try {
    await res.event.remove();
    res.json({ message: 'Deleted Event' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getEvent(req, res, next) {
  let event;
  try {
    event = await Event.findById(req.params.id);
    if (event == null) {
      return res.status(404).json({ message: 'Cannot find event' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.event = event;
  next();
}

module.exports = router;