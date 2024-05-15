const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer'); // Add this line
const mysql = require('./mysql');
const appPayRoute = require('./appFeePaymentRoute');
const firstPayRoute = require('./firstinst');



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

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename for uploaded files
    }
});

// Create multer instance
const upload = multer({ storage: storage });

// Serve HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/app_payment', (req, res) => res.sendFile(path.join(__dirname, 'public', 'app_payment.html')));
app.get('/apply', (req, res) => res.sendFile(path.join(__dirname, 'public', 'apply.html')));
app.get('/school_payment', (req, res) =>res.sendFile(path.join(__dirname, 'public', 'school_payment.html')));

// Use multer middleware for handling file uploads
app.use(upload.any());

// Use routes defined 
firstPayRoute(app);
appPayRoute(app)
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
