const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

// Payment
router.get("/", function (req, res) {
    const order_id = uuidv4();
    const customer_id = req.query.customer_id;
    const customer_name = req.query.customer_name;
    const email_id = req.query.email_id;
    const phone_number = req.query.phone_number;
    const amount = req.query.amount;
    const merchant_id = req.query.merchant_id;
    if (
        order_id === undefined ||
        customer_id === undefined ||
        customer_name === undefined ||
        email_id === undefined ||
        phone_number === undefined ||
        amount === undefined ||
        merchant_id === undefined
    ) {
        res.status(500).send("Some Fields are missing");
    } else {
        res.send("Payment");
    }
});

module.exports = router;
