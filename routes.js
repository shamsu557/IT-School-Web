const db = require('./mysql');

module.exports = function (app) {
    // Handle form submission
    app.post('/submit', (req, res) => {
        const { surname, firstName, address, emailAddress, phoneNumber, dob, highestQualification, courseApplied, hasComputerCertificate, picture } = req.body;

        // Check if the email or phone number already exists in the database
        const checkIfExistsQuery = 'SELECT * FROM form_data WHERE emailAddress = ? OR phoneNumber = ?';
        db.query(checkIfExistsQuery, [emailAddress, phoneNumber], (checkErr, checkResult) => {
            if (checkErr) {
                console.error('Error checking for existing email or phone number:', checkErr);
                res.status(500).send('An error occurred while processing the form');
                return;
            }

            if (checkResult.length > 0) {
                // Email or phone number already exists in the database
                res.status(400).send('Email address or phone number already registered');
                return;
            }

            // Calculate application fee and determine duration based on the course applied
            let applicationFee = 0;
            let duration = '';
            switch (courseApplied.toLowerCase()) {
                case 'web development':
                    applicationFee = 100;
                    duration = 'four months';
                    break;
                case 'computer appreciation':
                    applicationFee = 110;
                    duration = 'six weeks';
                    break;
                default:
                    applicationFee = 0;
                    duration = 'to be determined';
                    break;
            }

            // Generate temporary application number
            let initials = '';
            let courseAbbreviation = '';
            switch (courseApplied.toLowerCase()) {
                case 'web development':
                    initials = 'F';
                    courseAbbreviation = 'WEB';
                    break;
                case 'computer appreciation':
                    initials = 'F';
                    courseAbbreviation = 'CA';
                    break;
                default:
                    initials = 'O';
                    courseAbbreviation = 'OTH';
                    break;
            }
            const uniqueNumber = Math.floor(Math.random() * 10000);
            const applicationNumber = initials + courseAbbreviation + uniqueNumber;

            // Insert form data into MySQL database with empty reference number
            const insertQuery = 'INSERT INTO form_data (applicationNumber, surname, firstName, address, emailAddress, phoneNumber, dob, highestQualification, courseApplied, hasComputerCertificate, picture, applicationFee, referenceNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            db.query(insertQuery, [applicationNumber, surname, firstName, address, emailAddress, phoneNumber, dob, highestQualification, courseApplied, hasComputerCertificate, picture, applicationFee, ''], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error('Error inserting data into MySQL:', insertErr);
                    res.status(500).send('An error occurred while submitting the form');
                    return;
                }
                console.log('Data inserted into MySQL table:', insertResult);

                // Send response with application details
                const welcomeMessage = `Dear ${firstName}, congratulations! You have applied to study ${courseApplied} at CompuTech Nexus Academy. The duration of the course is ${duration}. Your application number is ${applicationNumber}. Application fee: ${applicationFee}. Please proceed to download your application letter and proceed to payment.`;
                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Form Submission</title>
                        <style>
                            body {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100vh;
                                margin: 0;
                                text-align: center;
                            }
                            .message {
                                width: 80%;
                                max-width: 600px;
                                margin: auto;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="message">
                        <p>${welcomeMessage}</p>
                        <p>Click <a href="/admission_letter/${applicationNumber}" target="_blank">here</a> to download or print your application letter.</p>
                        <p>Click continue to proceed to payment</p>
                        <form action="/app_payment" method="GET">
                            <input type="hidden" name="applicationNumber" value="${applicationNumber}">
                            <button type="submit">Continue</button>
                        </form>
                        </div>
                    </body>
                    </html>
                `);
            });
        });
    });

    // Serve the application letter based on application number
    app.get('/admission_letter/:applicationNumber', (req, res) => {
        const applicationNumber = req.params.applicationNumber;

        // Query the database to fetch student details based on the application number
        const query = 'SELECT * FROM form_data WHERE applicationNumber = ?';
        db.query(query, [applicationNumber], (err, result) => {
            if (err) {
                console.error('Error fetching student details:', err);
                res.status(500).send('An error occurred while fetching student details');
                return;
            }

            if (result.length === 1) {
                const studentDetails = result[0];
                // Generate the content of the application letter
                const applicationLetter = `
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Application Letter</title>
                    <style>
                        body {
                            text-align: center;
                            font-family: Arial, sans-serif;
                        }
                        .school-name {
                            font-size: 24px;
                            font-weight: bold;
                            margin-top: 40px; /* Adjust margin to push the school name down */
                            margin-bottom: 40px;
                        }
                        .school-logo {
                            margin-bottom: 15px;
                            width: 110px; /* Adjust the width and height to your preference */
                            height: 110px;
                            border-radius: 50%; /* Make the image circular */
                            object-fit: cover; /* Ensure the image covers the circular area */
                        }
                        .application-letter {
                            margin: auto;
                            max-width: 600px;
                            padding: 20px;
                            border: 2px solid #000;
                        }
                        .signature {
                            margin-top: 40px;
                            text-align: right;
                        }
                        .signature img {
                            width: 150px; /* Adjust the width of the signature image */
                            height: auto;
                        }
                    </style>
                </head>
                <body>
                    <div class="school-name"><h1>CompuTech Nexus Academy</h1></div>
                    <h3>32Km, Maiduguri Road, Gano 2 Primary School, Dawakin Kudu L.G.A, Kano, Nigeria<br></h3>
                    <h4>Contact: shamsusabocom@gmail.com, 1440shamsusabo@gmail.com</h4>
                    <center><h4>08030909793</h4></center>
                    <img src="logo.jpg" class="school-logo" alt="Logo">
                    <div class="application-letter">
                        <h1>Application Letter</h1> 
                        <p>Dear <strong>${studentDetails.firstName} ${studentDetails.surname}</strong>,</p>
                        <p>Congratulations! You have applied to study ${studentDetails.courseApplied} at CompuTech Nexus Academy.</p>
                        <p>Please keep this letter safe as proof of your application.</p>
                        <p>Sincerely,</p>
                        <div style="text-align: center;">
                            <p>Registrar</p>
                            <img src="registrar_signature.jpg" alt="Registrar Signature">
                            <p>Jazuli Adam Sulaiman</p>
                            <p>CompuTech Nexus Academy</p>
                        </div>
                    </div>
                </body>
                </html>
                `;
                // Send the application letter as a downloadable file
                res.setHeader('Content-disposition', 'attachment; filename=application_letter.html');
                res.setHeader('Content-type', 'text/html');
                res.write(applicationLetter);
                res.end();
            } else {
                res.status(404).send('Student not found');
            }
        });
    });

    // Handle request to get student details
    app.get('/getStudentDetails', (req, res) => {
        const applicationNumber = req.query.applicationNumber;

        // Query the database to fetch student details based on the application number
        const query = 'SELECT * FROM form_data WHERE applicationNumber = ?';
        db.query(query, [applicationNumber], (err, result) => {
            if (err) {
                console.error('Error fetching student details:', err);
                res.status(500).send('An error occurred while fetching student details');
                return;
            }

            if (result.length === 1) {
                const studentDetails = result[0];
                res.json(studentDetails);
            } else {
                res.status(404).send('Student not found');
            }
        });
    });

    // Handle verification of payment
    app.get('/verifyPayment', (req, res) => {
        const referenceNumber = req.query.reference;
        const emailAddress = req.query.email; // Email address used for payment

        // Update the reference number in the database for the corresponding payment
        const updateQuery = 'UPDATE form_data SET referenceNumber = ? WHERE emailAddress = ? AND referenceNumber = ""';
        db.query(updateQuery, [referenceNumber, emailAddress], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Error updating reference number in the database:', updateErr);
                res.status(500).send('An error occurred while verifying payment');
                return;
            }

            if (updateResult.affectedRows === 1) {
                res.send('Payment verified successfully!');
            } else {
                res.status(404).send('Payment verification failed');
            }
        });
    });
};
