require('dotenv').config();
require('module-alias/register')
const express = require("express");
const cors = require('cors');

//routes
const affiliateRoutes = require("@routes/affiliateRoutes");
const planRoutes = require('@routes/planRoutes');
const therapeuticSituationRoutes = require('@routes/therapeuticSituationRoutes')
const providerRoute = require('@routes/providerRoute');
const specialtyRoute = require('@routes/specialtyRoute');
const agendaRoute = require('@routes/agendaRoute');
const reportRoutes = require('@routes/reportRoutes');

//task
const task = require('./task/AffiliateScheduledRegistration');

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api", affiliateRoutes);
app.use("/api", planRoutes);
app.use("/api", therapeuticSituationRoutes)
app.use("/api", reportRoutes);
app.use("/api", providerRoute);
app.use("/api", specialtyRoute);
app.use("/api", agendaRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});