import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AffiliateEntity } from './entities/AffiliateEntity';
import { config } from 'dotenv';
import { ProviderEntity } from './entities/ProviderEntity';
config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '805729',
    database: process.env.DB_NAME || 'mediunahur-db',
    entities: [AffiliateEntity, ProviderEntity],
    synchronize: true, //te genera las entidades en base de datos
    logging: true,
    migrations: ["src/infrastructure/database/migrations/*.ts"]
    // ssl: { rejectUnauthorized: false }
});
