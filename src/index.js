const express = require("express");
const bodyParser = require("body-parser");
const affiliateRoute = require("./interface/routes/affiliateRoute");
const therapeuticSituationRoute = require("./interface/routes/TherapeuticSituationRoute");
const cors = require('cors');

const app = express();
app.use(cors())
app.use(bodyParser.json());

app.use("/api", affiliateRoute);
app.use("/api", therapeuticSituationRoute);

app.listen(3000, () => console.log("Server running on port 3000"));