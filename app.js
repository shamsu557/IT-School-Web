const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('./mysql');
const routes = require('./routes');
const secondPaymntRoute = require('./pay2Route');
const firstPayRoute = require('./pay1Route');
const fs = require('fs');

const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Serve static files from the root directory
app.use(express.static(__dirname));


// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/app_payment', (req, res) => res.sendFile(path.join(__dirname, 'app_payment.html')));
app.get('/apply', (req, res) => res.sendFile(path.join(__dirname, 'apply.html')));
app.get('/firstpay', (req, res) => res.sendFile(path.join(__dirname, 'firstpay.html')));
app.get('/secondPay', (req, res) => res.sendFile(path.join(__dirname, 'secondPay.html')));

// Use routes defined and pass the upload instance
routes(app);
secondPaymntRoute(app);
firstPayRoute(app);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));