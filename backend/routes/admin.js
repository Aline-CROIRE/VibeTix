const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Ticket = require('../models/Ticket')
const { protect, admin } = require('../middleware/authMiddleware');

/**
* @swagger
* /admin/events:
*   get:
*     summary: Get all events for admin
*     description: Retrieve a list of all available events for admin.
*     tags: [Admin]
*     security:
*       - bearerAuth: []
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
*       401:
*         description: Not authorized, token failed.
*       403:
*         description: Not authorized as an admin.
*/

router.get('/events', protect, admin, async (req, res) => {
 try {
     const events = await Event.find();
     res.json(events);
 } catch (err) {
     res.status(500).json({ message: err.message });
 }
});
/**
* @swagger
* /admin/tickets:
*   get:
*     summary: Get all tickets for admin
*     description: Retrieve a list of all tickets for admin.
*     tags: [Admin]
*     security:
*       - bearerAuth: []
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
*        401:
*         description: Not authorized, token failed.
*        403:
*         description: Not authorized as an admin.
*/
router.get('/tickets', protect, admin, async (req, res) => {
 try {
     const tickets = await Ticket.find().populate('event');
     res.json(tickets);
 } catch (err) {
    res.status(500).json({ message: err.message });
 }
});
 /**
  * @swagger
  * /admin/events:
  *   post:
  *     summary: Create a new event
  *     description: Create a new event with the given information.
  *     tags: [Admin]
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
  *       403:
  *         description: Not authorized as an admin.
  */
 router.post('/events',protect, admin, async (req, res) => {
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
  * /admin/events/{id}:
  *   patch:
  *     summary: Update an existing event
  *     description: Update an existing event with the given information.
  *     tags: [Admin]
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
  *       403:
  *         description: Not authorized as an admin.
  */
 router.patch('/events/:id',protect, admin, getEvent, async (req, res) => {
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
* /admin/events/{id}:
*   delete:
*     summary: Delete an event
*     description: Delete an event with the given ID.
*     tags: [Admin]
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
*       403:
*         description: Not authorized as an admin.
*       500:
*         description: Internal server error.
*/
 router.delete('/events/:id',protect, admin, getEvent, async (req, res) => {
     try {
     await res.event.remove();
     res.json({ message: 'Deleted Event' });
     } catch (err) {
     res.status(500).json({ message: err.message });
     }
 });
/**
* @swagger
* /admin/tickets/{id}:
*   delete:
*     summary: Delete a ticket
*     description: Delete a ticket with the given ID.
*     tags: [Admin]
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
*       403:
*         description: Not authorized as an admin.
*       500:
*         description: Internal server error.
*/
 router.delete('/tickets/:id',protect, admin, getTicket, async (req, res) => {
     try {
         await res.ticket.remove();
         res.json({ message: 'Deleted Ticket' });
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