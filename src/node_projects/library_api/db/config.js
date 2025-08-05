import { Sequelize } from "sequelize";

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

try {
  await db.authenticate();
  console.log("Connection has been established successfully.");
} catch (e) {
  console.error("Unable to connect to the database: ", e);
}

export default {
  Sequelize,
  db,
};
