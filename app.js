const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('./mysql');
const routes = require('./routes');

const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve the login.html file
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve the app_payment.html file
app.get('/app_payment', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'app_payment.html'));
});

// Serve the apply.html file
app.get('/apply', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'apply.html'));
});

// Use routes defined in routes.js
routes(app, mysql);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
