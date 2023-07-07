import { Sequelize } from "sequelize";

const POSTGRES_URL = process.env.DB_URL as unknown as string;

const sequelize = new Sequelize(POSTGRES_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
const connectDb = async () => {
    try {
        await sequelize.authenticate()
        console.log('connection established successfully')
    } catch (error) {
        console.log('Unable to connect with database', error)
    }
}

export{connectDb, sequelize, Sequelize}