import express from 'express';
import affiliateRoutes from './routes/affiliates.route';

const app = express();

app.use(express.json());

app.use('/api/v1/affiliates', affiliateRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;