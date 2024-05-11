const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

router.get("/", function (req, res) {
    res.json("Welcome to Payment API");
});

const paymentRoutes = require("../routes/paymentRoutes");
app.use("/.netlify/functions/api/payment", paymentRoutes);

app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log("Server is up on http://localhost:" + PORT);
});
