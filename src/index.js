require('module-alias/register')
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const affiliateRoute = require('./interface/routes/affiliateRoute');
// const therapeuticSituationRoute = require('./interface/routes/TherapeuticSituationRoute');
// const planRoute = require('./interface/routes/planRouter');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use(affiliateRoute);
// app.use(therapeuticSituationRoute);
// app.use(planRoute);

app.listen(3000, () => console.log('Server running'));
