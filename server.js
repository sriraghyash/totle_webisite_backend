const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const {sequelize} = require("./db/mysql_connect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const languageRoutes = require("./routes/languageRoutes");
const { insertLanguages } = require("./models/Language");
const catalogRoutes = require('./routes/catalog'); 
const bodyParser = require('body-parser');



sequelize
  .sync() // Sync the database
  .then(async () => {
    await insertLanguages(); 
  })
  .catch((error) => {
    console.error("Error syncing tables:", error);
  });


// Initialize app
const app = express();
const googleCors = {
  origin: ["http://localhost:3000", "https://www.totle.co"],
  credentials: true,
};

app.use(cors(googleCors));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.MY_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/languages", languageRoutes);
app.use("/catalog", catalogRoutes);

// Database Sync
sequelize.sync().then(() => {
  console.log("Database connected and synced.");
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
