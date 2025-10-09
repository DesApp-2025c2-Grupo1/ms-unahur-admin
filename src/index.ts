import express from 'express';
import { affiliateRoutes } from './interface/routes/affiliateRoutes';
import { affiliateSituationRouter } from './interface/routes/affiliateSituationRouter';

const app = express();

app.use(express.json());

app.use('/api/v1/affiliates', affiliateRoutes);
app.use('/api/v1/situations', affiliateSituationRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;