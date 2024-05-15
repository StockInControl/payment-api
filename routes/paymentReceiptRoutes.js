const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const auth = require("../controllers/authorization");
const db = require("../models");
const _ = require("lodash");

// Get All Payments Data
router.get("/", function (req, res) {
    db.Payment.findAll({
        includes: [{ model: db.Customer, as: "customer" }],
        order: [["createdAt", "DESC"]],
    }).then((allpayment) => res.send(allpayment));
});

// Payment Success
router.post("/success", function (req, res) {
    db.Customer.findOne({
        where: {
            Name: req.body.firstname,
        },
    }).then(async (customer_record) => {
        if (!customer_record) {
            const uuid = uuidv4();
            await db.Customer.create({
                Customer_id: uuidv4(),
                Name: req.body.firstname,
            }).then(async (new_customer) => {
                console.log(new_customer.dataValues);
                await db.Payment.create({
                    Payment_id: req.body.mihpayid,
                    Transaction_id: req.body.txnid,
                    Amount: req.body.amount,
                    Status: req.body.status,
                    Gateway: req.query.gateway,
                    Customer_id: new_customer.dataValues.Customer_id,
                }).then((new_payment) => console.log("New Payment Inserted with New Customer"));
                let data = `customer_id=${uuid}&customer_name=${req.body.firstname}&amount=${req.body.amount}&transaction_id=${req.body.txnid}&payment_id=${req.body.mihpayid}&date_time=${req.body.addedon}&status=${req.body.status}`;
                return res.redirect(`https://payment-integration252.netlify.app/paymentreceipt?${data}`);
            });
        } else {
            db.Payment.create({
                Payment_id: req.body.mihpayid,
                Transaction_id: req.body.txnid,
                Amount: req.body.amount,
                Status: req.body.status,
                Gateway: req.query.gateway,
                Customer_id: customer_record.dataValues.Customer_id,
            }).then((new_payment) => console.log("New Payment Inserted with Old Customer"));
            let data = `customer_id=${customer_record.dataValues.Customer_id}&customer_name=${req.body.firstname}&amount=${req.body.amount}&transaction_id=${req.body.txnid}&payment_id=${req.body.mihpayid}&date_time=${req.body.addedon}&status=${req.body.status}`;
            return res.redirect(`https://payment-integration252.netlify.app/paymentreceipt?${data}`);
        }
    });
});

// Payment Success
router.post("/failure", function (req, res) {
    db.Customer.findOne({
        where: {
            Name: req.body.firstname,
        },
    }).then(async (customer_record) => {
        if (!customer_record) {
            const uuid = uuidv4();
            await db.Customer.create({
                Customer_id: uuid,
                Name: req.body.firstname,
            }).then((new_customer) => console.log(new_customer.dataValues));
            await db.Payment.create({
                Payment_id: req.body.mihpayid,
                Transaction_id: req.body.txnid,
                Amount: req.body.amount,
                Status: req.body.status,
                Gateway: req.query.gateway,
                Customer_id: uuid,
            }).then((new_payment) => console.log("New Payment Inserted with New Customer"));
            let data = `customer_id=${uuid}&customer_name=${req.body.firstname}&amount=${req.body.amount}&transaction_id=${req.body.txnid}&payment_id=${req.body.mihpayid}&date_time=${req.body.addedon}&status=${req.body.status}`;
            return res.redirect(`https://payment-integration252.netlify.app/paymentreceipt?${data}`);
        } else {
            db.Payment.create({
                Payment_id: req.body.mihpayid,
                Transaction_id: req.body.txnid,
                Amount: req.body.amount,
                Status: req.body.status,
                Gateway: req.query.gateway,
                Customer_id: customer_record.dataValues.Customer_id,
            }).then((new_payment) => console.log("New Payment Inserted with Old Customer"));
            let data = `customer_id=${customer_record.dataValues.Customer_id}&customer_name=${req.body.firstname}&amount=${req.body.amount}&transaction_id=${req.body.txnid}&payment_id=${req.body.mihpayid}&date_time=${req.body.addedon}&status=${req.body.status}`;
            return res.redirect(`https://payment-integration252.netlify.app/paymentreceipt?${data}`);
        }
    });
});

module.exports = router;
