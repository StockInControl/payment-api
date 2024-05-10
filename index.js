const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", function (req, res) {
    res.send("Welcome to Payment API");
});

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log("Server is up on http://localhost:" + PORT);
});
