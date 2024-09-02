const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./db_config/db');
const userRoutes = require('./routes/userRoutes');
const waterLogRoutes = require('./routes/waterLogRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
connectDB();

app.get('/', (req, res) => {
    // welcome and return the ip address of the client
    res.send(`Welcome to the Water Tracker API. Your IP address is ${req.ip}`);
    });

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', waterLogRoutes);

// Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
