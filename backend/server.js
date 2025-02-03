const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const eventsRouter = require('./routes/events');
const ticketsRouter = require('./routes/tickets');
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
      //Swagger setup
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => {
    res.send("Server is running");
});

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/events', eventsRouter);
app.use('/tickets', ticketsRouter);


// Start server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));