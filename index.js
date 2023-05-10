require("dotenv").config(); /* Require DotEnv */
//
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
// const passport = require("passport");
// const session = require("express-session");
// const PLM = require("passport-local-mongoose");
const handleRequests = require("./controller/handleRequests");
//
const { log } = console;

const app = express();

// set middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
//   session({
//     secret: process.env.STROMIND_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

//? CONNECTION TO DATABASE, DATABASE SCHEMA, DATABASE MODEL
mongoose.connect(process.env.LOCAL_API_URL);
try {
  log("Connected!");
} catch {
  log("Failed!");
}

//Create Schema
const userSchema = new mongoose.Schema({
  fullname: { type: String },
  email: { type: String },
  password: { type: String, min: 6 },
});

// use plugin
// userSchema.plugin(PLM)

// Create database Model
const StrogeDevUsers = mongoose.model("StrogeDevUsers", userSchema);
//
// passport.use(StrogeDevUsers.createStrategy());
// passport.serializeUser(StrogeDevUsers.serializeUser())
// passport.deserializeUser(StrogeDevUsers.deserializeUser())

// Create Thoughts Schmea
const thoughtSchema = new mongoose.Schema({
  uid: String,
  timeStamp: String,
  thought: String,
});

// create databse model
const UserThoght = mongoose.model("UserThought", thoughtSchema);

// execute fn To hanlde All route, Callinf from controller
handleRequests(app, StrogeDevUsers, UserThoght);

app.listen(process.env.PORT || 3000, () =>
  log("Server Has Started On Port! Happy Coding Stroge")
);
