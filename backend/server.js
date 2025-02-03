const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const eventsRouter = require('./routes/events');
const ticketsRouter = require('./routes/tickets');
const authRouter = require('./routes/auth');
const paymentRouter = require('./routes/payment')
const adminRouter = require('./routes/admin')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');


require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Enable cors for all routes
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());
 /**
    * @swagger
    * components:
    *   schemas:
    *     Event:
    *       type: object
    *       required:
    *         - title
    *         - description
    *         - date
    *         - venue
    *         - totalTickets
    *         - availableTickets
    *         - price
    *       properties:
    *         _id:
    *            type: string
    *            description: The auto-generated id of the event
    *         title:
    *           type: string
    *           description: Title of the event.
    *         description:
    *           type: string
    *           description: Short description of the event.
    *         date:
    *           type: string
    *           format: date-time
    *           description: Date and time of the event.
    *         venue:
    *           type: string
    *           description: Venue of the event.
    *         totalTickets:
    *           type: integer
    *           description: Total number of tickets available for the event.
    *         availableTickets:
    *             type: integer
    *             description: Number of tickets currently available for the event.
    *         price:
    *           type: number
    *           format: float
    *           description: Price of the ticket for the event.
    *         __v:
    *             type: integer
    *             description: Version key
    *     EventInput:
    *      type: object
    *      required:
    *        - title
    *        - description
    *        - date
    *        - venue
    *        - totalTickets
    *        - price
    *      properties:
    *        title:
    *          type: string
    *          description: Title of the event.
    *        description:
    *          type: string
    *          description: Short description of the event.
    *        date:
    *          type: string
    *          format: date-time
    *          description: Date and time of the event.
    *        venue:
    *          type: string
    *          description: Venue of the event.
    *        totalTickets:
    *          type: integer
    *          description: Total number of tickets available for the event.
    *        price:
    *          type: number
    *          format: float
    *          description: Price of the ticket for the event.
    *     Ticket:
    *      type: object
    *      required:
    *        - event
    *        - user
    *      properties:
    *        _id:
    *          type: string
    *          description: The auto-generated id of the ticket
    *        event:
    *           $ref: '#/components/schemas/Event'
    *           description: The event of the ticket
    *        user:
    *            type: string
    *            description: The user that purchased the ticket
    *        purchaseDate:
    *          type: string
    *          format: date-time
    *          description: Date and time of the purchase.
    *        qrCode:
    *           type: string
    *           description: The base64 string of the qr code
    *        __v:
    *            type: integer
    *            description: Version key
    *     TicketInput:
    *       type: object
    *       required:
    *         - eventId
    *         - user
    *       properties:
    *         eventId:
    *            type: string
    *            description: The id of the event
    *         user:
    *           type: string
    *           description: The user that purchased the ticket
    *     UserRegisterInput:
    *       type: object
    *       required:
    *         - username
    *         - password
    *       properties:
    *         username:
    *           type: string
    *           description: The username of the user
    *         password:
    *           type: string
    *           description: The password of the user
    *     UserLoginInput:
    *       type: object
    *       required:
    *         - username
    *         - password
    *       properties:
    *         username:
    *           type: string
    *           description: The username of the user
    *         password:
    *           type: string
    *           description: The password of the user
    *     PaymentInput:
    *         type: 'object',
    *           required: ['amount', 'payment_method', 'ticketId'],
    *           properties: {
    *               amount: {
    *                 type: 'integer',
    *                 description: 'The amount of the payment intent',
    *                },
    *                payment_method: {
    *                   type: 'string',
    *                    description: 'The stripe payment method',
    *                     },
    *                     ticketId: {
    *                        type: 'string',
    *                      description: 'The id of the ticket'
    *                     },
    *              },
    */

app.get('/', (req, res) => {
    res.send("Server is running");
});

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRouter)
app.use('/events', eventsRouter);
app.use('/tickets', ticketsRouter);
app.use('/payment', paymentRouter);
app.use('/admin', adminRouter)


// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));