const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const auth = require("../controllers/authorization");
const axios = require("axios");
const db = require("../models");
const _ = require("lodash");

// Get Access Token
router.get("/", async function (req, res) {
    await axios
        .post(
            "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token",
            { realmName: "ni" },
            {
                headers: {
                    "Content-Type": "application/vnd.ni-identity.v1+json",
                    Authorization: "Basic ZTljZjEwYjEtNWRkYS00MzJkLWE2MjMtZjZkMjI0ZjNmM2Y2OmY4OTQ1MjBiLTk0YjEtNDA0Ni1iMmMwLTk3YjU3MDljYmEzZQ==",
                },
            }
        )
        .then((response) => res.send(response.data));
});

// Make Order
// Send the Request properly
router.post("/order", async function (req, res) {
    let data = `customer_id=${req.body.customer_id}&customer_name=${req.body.customer_name}&amount=${req.body.amount}&token=${req.body.token}`;
    await axios
        .post(
            "https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/1e4fbfb6-bfe9-4f21-ac02-8623ecf0ffdd/orders",
            {
                action: "AUTH",
                amount: { currencyCode: "USD", value: req.body.amount },
                merchantAttributes: {
                    redirectUrl: "https://payment-api252.netlify.app/.netlify/functions/api/ngenius/orderdata?" + data,
                    // redirectUrl: "http://localhost:5000/.netlify/functions/api/ngenius/orderdata",
                },
            },
            {
                headers: {
                    "Content-Type": "application/vnd.ni-payment.v2+json",
                    Accept: "application/vnd.ni-payment.v2+json",
                    Authorization: "Bearer " + req.body.token,
                },
            }
        )
        .then((response) => res.send(response.data));
});

// Order Data
router.get("/orderdata", async function (req, res) {
    await axios
        .get(`https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/1e4fbfb6-bfe9-4f21-ac02-8623ecf0ffdd/orders/${req.query.ref}`, {
            headers: {
                Accept: "application/vnd.ni-payment.v2+json",
                Authorization: "Bearer " + req.query.token,
            },
        })
        .then((response) => {
            let all_data = {
                Payment_id: response.data._embedded.payment[0]._id.split(":")[2],
                Transaction_id: req.query.ref,
                Amount: response.data.amount.value,
                Status: response.data._embedded.payment[0]["3ds"].status,
                Gateway: "N-Genius",
                Customer_id: req.query.customer_id,
            };
            db.Customer.findOne({
                where: {
                    Name: req.query.customer_name,
                },
            }).then(async (customer_record) => {
                if (!customer_record) {
                    await db.Customer.create({
                        Customer_id: req.query.customer_id,
                        Name: req.query.customer_name,
                    }).then((new_customer) => console.log("New Customer Inserted"));
                    await db.Payment.create(all_data).then((new_payment) => console.log("New Payment Inserted with New Customer"));
                    let data = `customer_id=${req.query.customer_id}&customer_name=${req.query.customer_name}&amount=${all_data.Amount}&transaction_id=${all_data.Transaction_id}&payment_id=${all_data.Payment_id}&date_time=${response.data.createDateTime}&status=${all_data.Status}`;
                    // return res.redirect(`https://payment-integration252.netlify.app/paymentreceipt?${data}`);
                    return res.redirect(`https://localhost:3000/paymentreceipt?${data}`);
                } else {
                    db.Payment.create(all_data).then((new_payment) => console.log("New Payment Inserted with Old Customer"));
                    let data = `customer_id=${customer_record.dataValues.Customer_id}&customer_name=${req.query.customer_name}&amount=${all_data.Amount}&transaction_id=${all_data.Transaction_id}&payment_id=${all_data.Payment_id}&date_time=${response.data.createDateTime}&status=${all_data.Status}`;
                    // return res.redirect(`https://payment-integration252.netlify.app/paymentreceipt?${data}`);
                    return res.redirect(`https://localhost:3000/paymentreceipt?${data}`);
                }
            });
            console.log(all_data);
            // res.send(response.data);
        });
});

module.exports = router;
