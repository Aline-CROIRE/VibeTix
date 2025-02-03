const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'VIBETIX API',
            version: '1.0.0',
            description: 'API for managing events and tickets',
        },
        servers: [
        {
            url: 'http://localhost:5000',
        },
        ],
        components: {
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
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;