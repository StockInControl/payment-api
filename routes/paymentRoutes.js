const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const auth = require("../controllers/authorization");
const _ = require("lodash");

// Payment
router.get("/", auth.requireAuth, function (req, res) {
    const order_id = uuidv4();
    const customer_id = req.query.customer_id;
    const customer_name = req.query.customer_name;
    const email_id = req.query.email_id;
    const phone_number = req.query.phone_number;
    const amount = req.query.amount;
    const merchant_id = req.query.merchant_id;

    let required_field = {};
    if (customer_id === undefined) {
        required_field["customer_id"] = "Required";
    }
    if (customer_name === undefined) {
        required_field["customer_name"] = "Required";
    }
    if (email_id === undefined) {
        required_field["email_id"] = "Required";
    }
    if (phone_number === undefined) {
        required_field["phone_number"] = "Required";
    }
    if (amount === undefined) {
        required_field["amount"] = "Required";
    }
    if (merchant_id === undefined) {
        required_field["merchant_id"] = "Required";
    }
    if (!_.isEmpty(required_field)) {
        res.status(500).json(required_field);
    } else {
        let success = {
            order_id: order_id,
            transaction_id: uuidv4(),
            customer_id: customer_id,
            amount: amount,
            status: "success",
        };
        res.status(200).json(success);
    }
});

module.exports = router;
