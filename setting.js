import Sequelize from "sequelize";
import process from "process";
import dotenv from "dotenv";

dotenv.config();
export const sequelize = new Sequelize({
	username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATA,
    host: process.env.DB_HOST,
    dialect: "mysql",
    dialectOptions: {
        ssl: {trustServerCertificate: true}
    },
});
export default sequelize;
