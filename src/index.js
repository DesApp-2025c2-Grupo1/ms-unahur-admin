const express = require("express");
const bodyParser = require("body-parser");
const providerRoute = require("./interface/routes/affiliateRoute");
const cors = require('cors');

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.use("/api", providerRoute);

app.listen(3000, () => console.log("Server running on port 3000"));