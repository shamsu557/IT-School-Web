const db = require('./mysql');

module.exports = function (app) {
    // Handle form submission
    app.post('/submit', (req, res) => {
        const { courseApplied } = req.body;

        let totalFee = 0;
        let duration = '';
        switch (courseApplied.toLowerCase()) {
            case 'web development':
                totalFee = 50000;
                duration = 'four months';
                break;
            case 'computer appreciation':
                totalFee = 20000;
                duration = 'six weeks';
                break;
            default:
                totalFee = 0;
                duration = 'to be determined';
                break;
        }

        res.json({ totalFee, duration });
    });

    // Handle request to fetch student details for school fees payment
    app.get('/fetchStudentDetails', (req, res) => {
        const { admissionNumber, paymentNumber } = req.query;

        const query = 'SELECT * FROM form_data WHERE admissionNumber = ?';
        db.query(query, [admissionNumber], (err, result) => {
            if (err) {
                console.error('Error fetching student details:', err);
                return res.status(500).send('An error occurred while fetching student details');
            }

            if (result.length === 1) {
                const studentDetails = result[0];
                let installmentAmount = 0;
                let schoolFee = 0;
                switch (studentDetails.courseApplied.toLowerCase()) {
                    case 'web development':
                        schoolFee = 50000;
                        installmentAmount = paymentNumber === "1" ? 100 : 100; // First and second installment amount for Web Development
                        break;
                    case 'computer appreciation':
                        schoolFee = 20000;
                        installmentAmount = paymentNumber === "1" ? 101 : 101; // First and second installment amount for Computer Appreciation
                        break;
                    default:
                        schoolFee = 0;
                        installmentAmount = 0;
                        break;
                }
                studentDetails.schoolFee = schoolFee;
                studentDetails.installmentAmount = installmentAmount;
                res.json(studentDetails);
            } else {
                res.status(404).send('Student not found');
            }
        });
    });

    // Handle verification of payment for both installments
    app.get('/verifyPayment', (req, res) => {
        const { reference, email, firstName, admissionNumber, paymentNumber } = req.query;

        try {
            let updateQuery;
            let referenceNumberField;
            let paymentAmount;
            if (paymentNumber === "1") {
                updateQuery = 'UPDATE form_data SET firstPaymentReferenceNumber = ?, username = ?, password = ? WHERE admissionNumber = ?';
                referenceNumberField = 'firstPaymentReferenceNumber';
                paymentAmount = 100; // First installment amount for Web Development
            } else if (paymentNumber === "2") {
                updateQuery = 'UPDATE form_data SET secondPaymentReferenceNumber = ? WHERE admissionNumber = ?';
                referenceNumberField = 'secondPaymentReferenceNumber';
                paymentAmount = 100; // Second installment amount for Web Development
            } else {
                throw new Error('Invalid payment number');
            }

            db.query(updateQuery, [reference, admissionNumber, admissionNumber], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Error updating reference number in the database:', updateErr);
                    return res.status(500).send('An error occurred while verifying payment');
                }

                if (updateResult.affectedRows === 1) {
                    const installmentText = paymentNumber === "1" ? "first" : "second";
                    const schoolVerifyMessage = `Dear ${firstName}, Your payment for the ${installmentText} installment with reference number ${reference} has been verified successfully! Use admission number ${admissionNumber} to login to your portal.`;
                    res.send(`
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Payment Verification</title>
                            <style>
                                body {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    margin: 0;
                                    text-align: center;
                                }
                                .appVerifyMessage {
                                    width: 80%;
                                    max-width: 600px;
                                    margin: auto;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="SchoolFeeVerifyMessage">
                                <p>${schoolVerifyMessage}</p>
                                <p>Click continue to login</p>
                                <form action="/login" method="GET">
                                    <button type="submit">Continue</button>
                                </form>
                            </div>
                        </body>
                        </html>
                    `);
                } else {
                    res.status(404).send('Payment verification failed');
                }
            });
        } catch (error) {
            console.error('Error occurred:', error);
            res.status(500).send('An error occurred while verifying payment');
        }
    });
};
