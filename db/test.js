const { Sequelize,DataTypes } = require("sequelize");
require("dotenv").config();
const path = require('path');
const fs = require('fs');

const databaseName = process.env.DB_NAME || "totle_dbv2";
const catalogDbName = process.env.DB_NAME2 || "totle_catalog_db";

// Sequelize instance for dbhost1
const sequelize = new Sequelize(databaseName, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
});

// Sequelize instance for dbhost2
const catalogSequelize = new Sequelize(catalogDbName, process.env.DB_USER2, process.env.DB_PASSWORD2, {
  host: process.env.DB_HOST2,
  dialect: "mysql",
  logging: false,
});
// console.log("Catalog Sequelize Initialized:", !!catalogSequelize);


// Dynamically load all models from the "models" folder
const models = { user: {}, catalog: {} };

// Load models for the main database
const userModelsPath = path.join(__dirname, "../models/userModels");
fs.readdirSync(userModelsPath)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    console.log(`Loading main DB model: ${file}`);
    const model = require(path.join(userModelsPath, file))(sequelize, DataTypes);
    models.user[model.name] = model;
  });

// Load models for the catalog database
const catalogModelsPath = path.join(__dirname, "../models/catalogModels");
fs.readdirSync(catalogModelsPath)
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    // console.log(`Loading catalog DB model: ${file}`);
    const model = require(path.join(catalogModelsPath, file))(catalogSequelize, DataTypes);
    if (!catalogSequelize) {
      console.error("catalogSequelize is undefined while loading:", file);
    }
    if (!model) {
      console.error("Failed to load model:", file);
    } else {
      console.log(`Successfully loaded model: ${model.name}`);
    }
    models.catalog[model.name] = model;
  });


// Associate models if associations are defined
Object.keys(models.user).forEach((modelName) => {
  if (models.user[modelName].associate) {
    models.user[modelName].associate(models.user);
  }
});
Object.keys(models.catalog).forEach((modelName) => {
  if (models.catalog[modelName].associate) {
    models.catalog[modelName].associate(models.catalog);
  }
});

async function initializeDatabases() {
  try {
    // Authenticate and sync the main database
    await sequelize.authenticate();
    console.log("Connected to the main database successfully.");
    await sequelize.sync({ alter: true });
    console.log("Main database models synchronized successfully.");

    if (models.Language) {
      await models.Language.insertLanguages();
    }
    // Authenticate and sync the catalog database
    await catalogSequelize.authenticate();
    console.log("Connected to the catalog database successfully.");
    console.log("Catalog Sequelize Initialized:", !!catalogSequelize);

    await catalogSequelize.sync({ alter: true });
    console.log("Catalog database models synchronized successfully.");
  } catch (error) {
    console.error("Error during database initialization:", error);
    process.exit(1);
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
console.log('adff',!!sequelize);

module.exports = { sequelize, cs:catalogSequelize, models };
