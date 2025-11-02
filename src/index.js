require('module-alias/register')
const express = require("express");

//routes
const affiliateRoutes = require("@routes/affiliateRoutes");
// const planRoutes = require('@routes/planRoutes');
// const therapeuticSituationRoutes = require('@routes/therapeuticSituationRoutes')

const app = express();
app.use(express.json());

app.use("/api", affiliateRoutes);
// app.use("/api", planRoutes);
// app.use("/api", therapeuticSituationRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running`);
});

