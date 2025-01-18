const { Sequelize, DataTypes } = require("sequelize");
const { insertLanguages } = require("../models/userModels/Language");
require("dotenv").config();

// Database Names
const databaseName = process.env.DB_NAME || "totle_dbv2";
const catalogDbName = process.env.DB_NAME2 || "totle_catalog_db";

// Sequelize instance for dbhost1 (main database)
const sequelize = new Sequelize(databaseName, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
});

// Sequelize instance for dbhost2 (catalog database)
const catalogSequelize = new Sequelize(catalogDbName, process.env.DB_USER2, process.env.DB_PASSWORD2, {
  host: process.env.DB_HOST2,
  dialect: "mysql",
  logging: false,
});

// Log Sequelize initialization
console.log("Catalog Sequelize Initialized:", !!catalogSequelize);
console.log("Main Sequelize Initialized:", !!sequelize);

// Models for Catalog DB

const Language = require('../models/userModels/Language')(sequelize, DataTypes);
async function initializeDatabases() {
  try {
    // Authenticate and sync the main database
    await sequelize.authenticate();
    console.log("Connected to the main database successfully.");
    await sequelize.sync({ alter: true });
    // await Language.insertLanguages();
    console.log("Main database models synchronized successfully.");

    // Authenticate and sync the catalog database
    await catalogSequelize.authenticate();
    console.log("Connected to the catalog database successfully.");
    await catalogSequelize.sync({ alter: true });
    console.log("Catalog database models synchronized successfully.");
  } catch (error) {
    console.error("Error during database initialization:", error);
    process.exit(1); // Exit with an error code if initialization fails
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await sequelize.close();
    console.log("Database connection to dbhost1 closed.");
    await catalogSequelize.close();
    console.log("Database connection to dbhost2 closed.");
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
});

// Initialize the databases
initializeDatabases();

// Export DB instances and models
module.exports = {
  sequelize,
  catalogSequelize,
};
