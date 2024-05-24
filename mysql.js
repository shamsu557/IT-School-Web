const { Client } = require('pg');

// PostgreSQL database connection
const db = new Client({
    host: 'localhost',
    user: 'root',
    password: '@Shamsu1440',
    database: 'applicationdb',
    port: 5432, // Default port for PostgreSQL
});

// Connect to PostgreSQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to PostgreSQL database:', err);
        return;
    }
    console.log('Connected to PostgreSQL database');
});

module.exports = db;
