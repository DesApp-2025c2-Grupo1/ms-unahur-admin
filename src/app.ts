import express from 'express';
import affiliateRoutes from './routes/affiliates.route';

const app = express();

app.use(express.json());

app.use('/api/v1/affiliates', affiliateRoutes);

export default app;