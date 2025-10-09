import express from 'express';
import { affiliateRoutes } from './interface/routes/affiliateRoutes';
import { affiliateSituationRouter } from './interface/routes/affiliateSituationRouter';
import { AppDataSource } from './infrastructure/database/data-source';


const app = express();

app.use(express.json());

app.use('/api/v1/affiliates', affiliateRoutes);
app.use('/api/v1/situations', affiliateSituationRouter)

const PORT = process.env.PORT || 3000;

//configuración de la base de datos
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected');
    app.listen(3000, () => console.log('🚀 Server running on port 3000'));
  })
  .catch((error) => {
    console.error('❌ Error connecting to database:', error);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;