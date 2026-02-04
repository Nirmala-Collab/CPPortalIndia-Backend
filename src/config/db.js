// src/config/db.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.qa' });
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: false, // set true for debugging SQL
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
export default sequelize;
