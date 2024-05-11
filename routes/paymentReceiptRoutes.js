const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const auth = require("../controllers/authorization");
const _ = require("lodash");

// Payment Success
router.post("/success", function (req, res) {
    let data = `customer_id=${req.query.customer_id}&customer_name=${req.body.firstname}&amount=${req.body.amount}&transaction_id=${req.body.txnid}&payment_id=${req.body.mihpayid}&date_time=${req.body.addedon}&status=${req.body.status}`;
    return res.redirect(`https://payment-integration252.netlify.app/paymentreceipt?${data}`);
});

// Payment Success
router.post("/failure", function (req, res) {
    let data = `customer_id=${req.query.customer_id}&customer_name=${req.body.firstname}&amount=${req.body.amount}&transaction_id=${req.body.txnid}&payment_id=${req.body.mihpayid}&date_time=${req.body.addedon}&status=${req.body.status}`;
    return res.redirect(`https://payment-integration252.netlify.app/paymentreceipt?${data}`);
});

module.exports = router;
