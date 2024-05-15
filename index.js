const express = require("express");
// const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

const { sequelize } = require("./models");
const app = express();
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

router.get("/", function (req, res) {
    res.json("Welcome to Payment API");
});

const ngeniusRoutes = require("./routes/ngeniusRoutes");
app.use("/api/ngenius", ngeniusRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

const paymentReceiptRoutes = require("./routes/paymentReceiptRoutes");
app.use("/api/paymentreceipt", paymentReceiptRoutes);

// app.use("/.netlify/functions/api", router);
// module.exports.handler = serverless(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log("Server is up on http://localhost:" + PORT);
    await sequelize.sync();
    await sequelize.authenticate();
    console.log("Database Connected");
});
