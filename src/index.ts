import express from 'express';
import cors from 'cors';
import { affiliateRoutes } from './interface/routes/affiliateRoutes';
import { affiliateSituationRouter } from './interface/routes/affiliateSituationRouter';
import { AppDataSource } from './infrastructure/database/data-source';

const app = express();
app.use(cors())

app.use(express.json());

app.use('/api/v1/affiliates', affiliateRoutes);
app.use('/api/v1/situations', affiliateSituationRouter)

const PORT = process.env.PORT || 3000;

//configuración de la base de datos
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => console.log('Server running'));
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });

export default app;