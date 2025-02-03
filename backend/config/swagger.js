const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Event Ticket Booking API',
      version: '1.0.0',
      description: 'API for managing events and tickets',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'Operations related to user authentication',
      },
      {
        name: 'Events',
        description: 'Operations related to events',
      },
      {
        name: 'Tickets',
        description: 'Operations related to tickets',
      },
      {
        name: 'Payment',
        description: 'Operations related to payments',
      },
      {
        name: 'Admin',
        description: 'Operations related to admin',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Event: {
          type: 'object',
          required: [
            'title',
            'description',
            'date',
            'venue',
            'totalTickets',
            'availableTickets',
            'price',
          ],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the event',
            },
            title: {
              type: 'string',
              description: 'Title of the event.',
            },
            description: {
              type: 'string',
              description: 'Short description of the event.',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time of the event.',
            },
            venue: {
              type: 'string',
              description: 'Venue of the event.',
            },
            totalTickets: {
              type: 'integer',
              description: 'Total number of tickets available for the event.',
            },
            availableTickets: {
              type: 'integer',
              description: 'Number of tickets currently available for the event.',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Price of the ticket for the event.',
            },
            __v: {
              type: 'integer',
              description: 'Version key',
            },
          },
        },
        EventInput: {
          type: 'object',
          required: ['title', 'description', 'date', 'venue', 'totalTickets', 'price'],
          properties: {
            title: {
              type: 'string',
              description: 'Title of the event.',
            },
            description: {
              type: 'string',
              description: 'Short description of the event.',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time of the event.',
            },
            venue: {
              type: 'string',
              description: 'Venue of the event.',
            },
            totalTickets: {
              type: 'integer',
              description: 'Total number of tickets available for the event.',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Price of the ticket for the event.',
            },
          },
        },
        Ticket: {
          type: 'object',
          required: ['event', 'user'],
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated id of the ticket',
            },
            event: {
              $ref: '#/components/schemas/Event',
              description: 'The event of the ticket',
            },
            user: {
              type: 'string',
              description: 'The user that purchased the ticket',
            },
            purchaseDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date and time of the purchase.',
            },
            qrCode: {
              type: 'string',
              description: 'The base64 string of the qr code',
            },
            __v: {
              type: 'integer',
              description: 'Version key',
            },
          },
        },
        TicketInput: {
          type: 'object',
          required: ['eventId', 'user'],
          properties: {
            eventId: {
              type: 'string',
              description: 'The id of the event',
            },
            user: {
              type: 'string',
              description: 'The user that purchased the ticket',
            },
          },
        },
        UserRegisterInput: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'The username of the user',
            },
            password: {
              type: 'string',
              description: 'The password of the user',
            },
          },
        },
        UserLoginInput: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'The username of the user',
            },
            password: {
              type: 'string',
              description: 'The password of the user',
            },
          },
        },
        PaymentInput: {
          type: 'object',
          required: ['amount', 'payment_method', 'ticketId'],
          properties: {
            amount: {
              type: 'integer',
              description: 'The amount of the payment intent',
            },
            payment_method: {
              type: 'string',
              description: 'The stripe payment method',
            },
            ticketId: {
              type: 'string',
              description: 'The id of the ticket',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // This should be a valid path
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
