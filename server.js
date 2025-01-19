const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const {sequelize} = require("./db/mysql_connect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const languageRoutes = require("./routes/languageRoutes");
const catalogRoutes = require('./routes/catalog'); 
const bodyParser = require('body-parser');

// Initialize app
const app = express();
// Middleware
const allowedOrigins = ['https://www.totle.co', 'https://mail.google.com', 'http://localhost:3000'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
// const googleCors = {
//   origin: ["http://localhost:3000", "https://www.totle.co"],
//   credentials: true,
// };
// app.use(cors(googleCors));

// Explicitly handle preflight (OPTIONS) requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || googleCors.origin[0]);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  return res.status(200).send();
});

app.set('trust proxy', 1);
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
