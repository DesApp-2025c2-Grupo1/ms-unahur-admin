require('module-alias/register')
const express = require("express");
const cors = require('cors');

//routes
const affiliateRoutes = require("@routes/affiliateRoutes");
const planRoutes = require('@routes/planRoutes');
const therapeuticSituationRoutes = require('@routes/therapeuticSituationRoutes')

// Providers
const providerRoute = require('./interfaces/routes/providerRoute');
const specialtyRoute = require('./interfaces/routes/specialtyRoute');

const app = express();
app.use(express.json());
app.use(cors())

app.use("/api", affiliateRoutes);
app.use("/api", planRoutes);
app.use("/api", therapeuticSituationRoutes)
app.use(providerRoute);
// Specialty routes mounted at root (no /api prefix)
app.use(specialtyRoute);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running`);
});

