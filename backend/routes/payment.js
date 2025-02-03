const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Ticket = require('../models/Ticket');
const {protect} = require('../middleware/authMiddleware')

/**
 * @swagger
 * /payment:
 *   post:
 *     summary: Creates a stripe payment intent
 *     description: Creates a stripe payment intent with the ticket id
 *     tags: [Payment]
 *     security:
 *        - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            required:
 *              - amount
 *              - payment_method
 *              - ticketId
 *            properties:
 *              amount:
 *                type: integer
 *                description: The amount of the payment intent
 *              payment_method:
 *                type: string
 *                description: The stripe payment method
 *              ticketId:
 *                 type: string
 *                 description: The id of the ticket
 *
 *     responses:
 *       200:
 *         description: Payment successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                     type: boolean
 *                     description: Status of the payment
 *                 message:
 *                     type: string
 *                     description: Message for the payment
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Not authorized, token failed.
 */
router.post('/', protect, async (req, res) => {
    try {
        const {amount, payment_method, ticketId} = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            payment_method: payment_method,
            confirm: true,
            return_url: 'http://localhost:3000',
        });

        const ticket = await Ticket.findById(ticketId);
        if(ticket){
             res.status(200).json({success:true, message: "Payment successful"});
         } else {
             res.status(400).json({success:false, message: "Could not find ticket"});
        }
    } catch(err){
        res.status(400).json({success:false, message: err.message})
    }

})

module.exports = router;